import * as signalR from '@aspnet/signalr';

//import version from '../version';
import * as actions from '../actions';

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

        state.lobby.socket.invoke(message, ...args).catch(err => console.error(err.toString()));

        return dispatch(socketMessageSent(message));
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

export function authenticateSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if(state.lobby.socket && state.auth.token) {
            return dispatch(sendSocketMessage('authenticate', state.auth.token));
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

export function reconnectSocket(socket) {
    return (dispatch) => {
        dispatch(lobbyReconnecting());

        socket.start()
            .then(() => dispatch(lobbyConnected()))
            .catch(() => {
                setTimeout(() => dispatch(reconnectSocket(socket)), 3000);
            });
    };
}

export function connectLobby() {
    return (dispatch, getState) => {
        let state = getState();
        let socket = new signalR.HubConnectionBuilder()
            .withUrl('/lobby', { accessTokenFactory: () => state.auth.token })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        dispatch(lobbyConnecting(socket));

        socket.start()
            .then(() => dispatch(lobbyConnected()))
            .catch(() => {
                setTimeout(() => dispatch(reconnectSocket(socket)), 3000);
            });

        // socket.on('disconnect', () => {
        //     dispatch(lobbyDisconnected());
        // });

        // socket.on('reconnect', () => {
        //     dispatch(lobbyReconnecting());
        // });

        // socket.on('games', games => {
        //     dispatch(lobbyMessageReceived('games', games));
        // });

        socket.on('users', users => {
            dispatch(lobbyMessageReceived('users', users));
        });

        // socket.on('newgame', game => {
        //     dispatch(lobbyMessageReceived, 'newgame', game);
        // });

        // socket.on('passworderror', message => {
        //     dispatch(lobbyMessageReceived('passworderror', message));
        // });

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

        //socket.on('gamestate', game => {
        //    state = getState();
        //    dispatch(lobbyMessageReceived('gamestate', game, state.account.user ? state.account.user.username : undefined));
        // });

        // socket.on('cleargamestate', () => {
        //     dispatch(lobbyMessageReceived('cleargamestate'));
        // });

        // socket.on('handoff', handoff => {
        //     dispatch(handoffReceived(handoff));
        // });

        // socket.on('authfailed', () => {
        //     dispatch(actions.authenticate());
        // });

        // socket.on('nodestatus', status => {
        //     dispatch(nodeStatusReceived(status));
        // });

        socket.on('removemessage', messageId => {
            dispatch(lobbyMessageReceived('removemessage', messageId));
        });
    };
}
