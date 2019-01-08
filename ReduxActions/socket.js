import * as signalR from '@aspnet/signalr';

//import version from '../version';
import * as actions from '../actions';
import { authenticate } from './account';

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

export function handoff(details) {
    return {
        type: 'HANDOFF_RECEIVED',
        details: details
    };
}

export function handoffReceived(details) {
    return (dispatch, getState) => {
        let url = '//' + details.address;
        let standardPorts = [80, 443];
        let state = getState();

        dispatch(handoff(details));

        if(details.port && !standardPorts.some(p => p === details.port)) {
            url += ':' + details.port;
        }

        dispatch(actions.setAuthTokens(details.authToken, state.auth.refreshToken));

        if(state.games.socket && state.games.gameId !== details.gameId) {
            dispatch(actions.closeGameSocket());
        }

        dispatch(actions.connectGameSocket(url, details.name));
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
            let attempt = getState().lobby.connectionAttempt;
            let maxDelay = 5000;
            let backOffFactor = 200 * Math.pow(2, attempt);
            let delay = Math.floor(Math.random() * (Math.min(maxDelay, backOffFactor) - 0 + 1) + 0);

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

        socket.on('games', games => {
            dispatch(lobbyMessageReceived('games', games));
        });

        socket.on('users', users => {
            dispatch(lobbyMessageReceived('users', users));
        });

        socket.on('newgame', game => {
            dispatch(lobbyMessageReceived('newgame', game));
        });

        socket.on('removegame', gameId => {
            dispatch(lobbyMessageReceived('removegame', gameId));
        });

        socket.on('joinfailed', reason => {
            dispatch(lobbyMessageReceived('joinfailed', reason));
        });

        socket.on('lobbychat', message => {
            dispatch(lobbyMessageReceived('lobbychat', message));
        });

        // socket.on('banner', notice => {
        //     dispatch(lobbyMessageReceived('banner', notice));
        // });

        // socket.on('banner', notice => {
        //    dispatch(lobbyMessageReceived('banner', notice));
        // });

        // socket.on('motd', motd => {
        //    dispatch(lobbyMessageReceived('motd', motd));
        // });

        socket.on('gamestate', game => {
            state = getState();
            dispatch(lobbyMessageReceived('gamestate', game, state.account.user ? state.account.user.username : undefined));
        });

        // socket.on('cleargamestate', () => {
        //     dispatch(lobbyMessageReceived('cleargamestate'));
        // });

        // socket.on('handoff', handoff => {
        //     dispatch(handoffReceived(handoff));
        // });

        // socket.on('nodestatus', status => {
        //     dispatch(nodeStatusReceived(status));
        // });

        socket.on('removemessage', messageId => {
            dispatch(lobbyMessageReceived('removemessage', messageId));
        });
    };
}
