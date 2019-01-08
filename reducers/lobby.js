import { reconnectLobbySocket } from '../ReduxActions/socket';
import { loop, Cmd } from 'redux-loop';

const defaultState = {
    games: [],
    users: [],
    messages: [],
    messageQueue: []
};

export default function (state = defaultState, action) {
    switch(action.type) {
        case 'LOBBY_CONNECTING':
            return Object.assign({}, state, {
                connecting: true,
                connected: false,
                connectionAttempt: 0,
                socket: action.socket
            });
        case 'LOBBY_CONNECTED':
            return Object.assign({}, state, {
                connecting: false,
                connected: true
            });
        case 'LOBBY_DISCONNECTED':
            return Object.assign({}, state, {
                connecting: false,
                connected: false,
                connectionAttempt: 0
            });
        case 'LOBBY_RECONNECTING':
            return Object.assign({}, state, {
                connected: false,
                connecting: true,
                connectionAttempt: state.connectionAttempt + 1
            });
        case 'LOBBY_MESSAGE_RECEIVED':
            return handleMessage(action, state);
        case 'LOBBY_MESSAGE_DELETED':
            return handleMessage(action, state);
        case 'JOIN_PASSWORD_GAME':
            return Object.assign({}, state, {
                passwordGame: action.game,
                passwordJoinType: action.joinType
            });
        case 'CANCEL_PASSWORD_JOIN':
            return Object.assign({}, state, {
                passwordGame: undefined,
                passwordError: undefined,
                passwordJoinType: undefined
            });
        case 'GAME_SOCKET_CLOSED':
            return Object.assign({}, state, {
                currentGame: undefined,
                newGame: false
            });
        case 'PROFILE_SAVED':
            if(state.socket) {
                return loop(state, Cmd.action(reconnectLobbySocket()));
            }
            break;
        case 'START_NEWGAME':
            return Object.assign({}, state, {
                newGame: true
            });
        case 'CANCEL_NEWGAME':
            return Object.assign({}, state, {
                newGame: false
            });
        case 'CLEAR_NEWGAME_STATUS':
            return Object.assign({}, state, {
                joinFailReason: undefined
            });
        case 'RECEIVE_LOBBY_MESSAGES':
            return Object.assign({}, state, {
                messages: action.response.messages
            });
        case 'SOCKET_MESSAGE_QUEUED':
            var messageQueue = state.messageQueue;
            messageQueue.push({ message: action.message, args: action.args });

            return Object.assign({}, state, {
                messageQueue: messageQueue
            });
        case 'CLEAR_GAMESTATE':
            return Object.assign({}, state, {
                newGame: false,
                currentGame: undefined
            });
    }

    return state;
}

function handleGameState(action, state) {
    let retState = Object.assign({}, state, {
        currentGame: action.args[0]
    });

    var username = action.args[1];

    var currentState = retState.currentGame;
    if(!currentState) {
        retState.newGame = false;
        return retState;
    }

    if(currentState && currentState.spectators.some(spectator => {
        return spectator === username;
    })) {
        return retState;
    }

    if(!currentState || !currentState.players[username] || currentState.players[username].left) {
        delete retState.currentGame;
        retState.newGame = false;
    }

    if(currentState) {
        delete retState.passwordGame;
        delete retState.passwordJoinType;
        delete retState.passwordError;
    }

    if(!retState.currentGame.started) {
        retState.newGame = true;
    }

    return retState;
}

function handleMessage(action, state) {
    let newState = state;

    switch(action.message) {
        case 'games':
            newState = Object.assign({}, state, {
                games: action.args[0]
            });

            // If the current game is no longer in the game list, it must have been closed
            if(state.currentGame && !action.args[0].some(game => {
                return game.id === state.currentGame.id;
            })) {
                newState.currentGame = undefined;
                newState.newGame = false;
            }

            break;
        case 'users':
            newState = Object.assign({}, state, {
                users: action.args[0]
            });

            break;
        case 'newgame':
            newState = Object.assign({}, state, {
                games: [
                    ...state.games, action.args[0]
                ]
            });

            break;
        case 'passworderror':
            newState = Object.assign({}, state, {
                passwordError: action.args[0]
            });

            break;
        case 'lobbychat':
            newState = Object.assign({}, state, {
                messages: [
                    ...state.messages, action.args[0]
                ]
            });

            break;
        case 'removemessage':
            newState = Object.assign({}, state);

            newState.messages = newState.messages.filter(message => {
                return message.id !== action.args[0];
            });

            break;
        case 'banner':
            newState = Object.assign({}, state, {
                notice: action.args[0]
            });

            break;
        case 'motd':
            newState = Object.assign({}, state, {
                motd: action.args[0]
            });

            break;
        case 'gamestate':
            newState = handleGameState(action, state);

            break;
        case 'cleargamestate':
            newState = Object.assign({}, state, {
                newGame: false,
                currentGame: undefined
            });

            break;
        case 'joinfailed':
            newState = Object.assign({}, state, {
                joinFailReason: action.args[0]
            });
            break;
    }

    return newState;
}
