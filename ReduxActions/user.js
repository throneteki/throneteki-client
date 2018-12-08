export function loadActiveSessions(user) {
    return {
        types: ['REQUEST_SESSIONS', 'RECEIVE_SESSIONS'],
        shouldCallAPI: () => true,
        APIParams: {
            cache: false,
            url: `/api/account/${user.username}/sessions`
        }
    };
}

export function removeSession(username, sessionId) {
    return {
        types: ['REMOVE_SESSION', 'SESSION_REMOVED'],
        shouldCallAPI: () => true,
        APIParams: {
            type: 'DELETE',
            url: `/api/account/${username}/sessions/${sessionId}`
        }
    };
}

export function loadBlockList(user) {
    return {
        types: ['REQUEST_BLOCKLIST', 'RECEIVE_BLOCKLIST'],
        shouldCallAPI: () => true,
        APIParams: {
            cache: false,
            url: `/api/account/${user.username}/blocklist`
        }
    };
}

export function addBlockListEntry(user, username) {
    return {
        types: ['ADD_BLOCKLIST', 'BLOCKLIST_ADDED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/account/${user.username}/blocklist`,
            type: 'POST',
            data: JSON.stringify({ username: username })
        }
    };
}

export function removeBlockListEntry(user, username) {
    return {
        types: ['DELETE_BLOCKLIST', 'BLOCKLIST_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/account/${user.username}/blocklist/${username}`,
            type: 'DELETE'
        }
    };
}

export function clearBlockListStatus() {
    return {
        type: 'CLEAR_BLOCKLIST_STATUS'
    };
}

export function clearSessionStatus() {
    return {
        type: 'CLEAR_SESSION_STATUS'
    };
}

export function saveProfile(username, details) {
    return {
        types: ['SAVE_PROFILE', 'PROFILE_SAVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/account/${username}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(processUser(details))
        }
    };
}

export function clearProfileStatus() {
    return {
        type: 'CLEAR_PROFILE_STATUS'
    };
}

function processUser(user) {
    user.customData = JSON.stringify({
        promptDupes: user.settings.promptDupes,
        keywordSettings: user.settings.keywordSettings,
        promptedActionWindows: user.promptedActionWindows,
        timerSettings: Object.assign({}, user.settings.timerSettings, { windowTimer: user.settings.windowTimer })
    });

    return user;
}
