export function receiveUsers(users) {
    return {
        type: 'RECEIVE_USERS',
        users: users
    };
}

export function receiveLobbyMessage(message) {
    return {
        type: 'RECEIVE_LOBBY_MSG',
        message: message
    };
}

export function loadMessages() {
    return {
        types: ['REQUEST_LOBBY_MESSAGES', 'RECEIVE_LOBBY_MESSAGES'],
        shouldCallAPI: (state) => {
            return state.lobby.messages.length === 0;
        },
        APIParams: { url: '/api/messages/', cache: false }
    };
}

export function sendLobbyMessage(message) {
    return {
        types: ['SEND_LOBBY_MESSAGE', 'LOBBY_MESSAGE_SENT'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/messages/',
            contentType: 'application/json',
            cache: false,
            type: 'POST',
            data: JSON.stringify({ Message: message })
        }
    };
}

export function removeLobbyMessage(messageId) {
    return {
        types: ['REMOVE_MESSAGE', 'MESSAGE_REMOVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/messages/${messageId}`,
            cache: false,
            type: 'DELETE'
        }
    };
}
