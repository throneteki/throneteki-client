import * as signalR from '@aspnet/signalr';
import { ExponentialBackoff } from 'simple-backoff';

//import version from '../version';
import * as actions from '../actions';
import { authenticate } from './account';

const backOff = new ExponentialBackoff({
    min: 300,
    max: 30000,
    factor: 1.5,
    jitter: 0.4
});

export function socketMessageSent(message) {
    return {
        type: 'SOCKET_MESSAGE_SENT',
        message: message
    };
}

export function queueSocketMessage(message, ...args) {
    return {
        type: 'SOCKET_MESSAGE_QUEUED',
        message: message,
        args: args
    };
}

export function sendSocketMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        if(!state.lobby.connected) {
            return dispatch(queueSocketMessage(message, args));
        }

        state.lobby.socket.invoke(message, ...args)
            .then(() => {
                dispatch(socketMessageSent(message));
            })
            .catch(err => {
                if(err.message.includes('unauthorized')) {
                    dispatch(authenticate());
                }
            });
    };
}

export function sendGameMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        if(state.games.socket) {
            state.games.socket.emit('game', message, ...args);
        }

        return dispatch(socketMessageSent(message));
    };
}

export function lobbyConnecting(socket) {
    return {
        type: 'LOBBY_CONNECTING',
        socket: socket
    };
}

export function lobbyConnected(socket) {
    return {
        type: 'LOBBY_CONNECTED',
        socket: socket
    };
}

export function lobbyDisconnected() {
    return {
        type: 'LOBBY_DISCONNECTED'
    };
}

export function lobbyReconnecting() {
    return {
        type: 'LOBBY_RECONNECTING'
    };
}

export function lobbyMessageReceived(message, ...args) {
    return {
        type: 'LOBBY_MESSAGE_RECEIVED',
        message: message,
        args
    };
}

export function reconnectLobbySocket() {
    return (dispatch, getState) => {
        let state = getState();

        if(!state.lobby.connected) {
            return;
        }

        if(state.lobby.socket && state.auth.token) {
            dispatch(lobbyReconnecting());
            state.lobby.socket.stop().then(() => {
                connectSocket(state.lobby.socket, dispatch, getState);
            });
        }
    };
}

export function handoff(address, token, gameId) {
    return {
        type: 'HANDOFF_RECEIVED',
        details: { address: address, token: token, gameId: gameId}
    };
}

export function handoffReceived(address, nodeName, token, gameId) {
    return (dispatch, getState) => {
        let url = '//' + address;
        let state = getState();

        dispatch(handoff(address, token, gameId));

        if(state.games.socket && state.games.gameId !== gameId) {
            dispatch(actions.closeGameSocket());
        }

        dispatch(actions.connectGameSocket(url, nodeName, token, gameId));
    };
}

export function nodeStatusReceived(status) {
    return {
        type: 'NODE_STATUS_RECEIVED',
        status: status
    };
}

function connectSocket(socket, dispatch, getState) {
    let state = getState();

    if(state.lobby.connected || state.lobby.connecting) {
        return;
    }

    dispatch(lobbyConnecting(socket));

    socket.start()
        .then(() => dispatch(lobbyConnected(socket)))
        .catch(() => {
            let delay = backOff.next();
            setTimeout(() => dispatch(reconnectSocket(socket)), delay);
        });
}

export function reconnectSocket(socket) {
    return (dispatch, getState) => {
        dispatch(lobbyReconnecting());

        connectSocket(socket, dispatch, getState);
    };
}

export function connectLobby() {
    return (dispatch, getState) => {
        backOff.reset();

        let state = getState();
        let socket = new signalR.HubConnectionBuilder()
            .withUrl('/lobby', { accessTokenFactory: () => getState().auth.token })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        socket.onclose(error => {
            dispatch(lobbyDisconnected());

            if(error || getState().lobby.reconnecting) {
                dispatch(reconnectSocket(socket));
            }
        });

        connectSocket(socket, dispatch, getState);

        socket.on('GameList', games => {
            dispatch(lobbyMessageReceived('games', games));
        });

        socket.on('UserList', users => {
            dispatch(lobbyMessageReceived('users', users));
        });

        socket.on('NewGame', game => {
            dispatch(lobbyMessageReceived('newgame', game));
        });

        socket.on('RemoveGame', gameId => {
            dispatch(lobbyMessageReceived('removegame', gameId));
        });

        socket.on('UpdateGame', game => {
            dispatch(lobbyMessageReceived('updategame', game));
        });

        socket.on('JoinFailed', reason => {
            dispatch(lobbyMessageReceived('joinfailed', reason));
        });

        socket.on('LobbyChatMessage', message => {
            dispatch(lobbyMessageReceived('lobbychat', message));
        });

        // socket.on('banner', notice => {
        //     dispatch(lobbyMessageReceived('banner', notice));
        // });

        // socket.on('motd', motd => {
        //    dispatch(lobbyMessageReceived('motd', motd));
        // });

        socket.on('GameState', game => {
            state = getState();
            dispatch(lobbyMessageReceived('gamestate', game, state.account.user ? state.account.user.username : undefined));
        });

        // socket.on('cleargamestate', () => {
        //     dispatch(lobbyMessageReceived('cleargamestate'));
        // });

        socket.on('HandOff', (address, nodeName, token, gameId) => {
            dispatch(handoffReceived(address, nodeName, token, gameId));
        });

        // socket.on('nodestatus', status => {
        //     dispatch(nodeStatusReceived(status));
        // });

        socket.on('RemoveLobbyMessage', messageId => {
            dispatch(lobbyMessageReceived('removemessage', messageId));
        });
    };
}
