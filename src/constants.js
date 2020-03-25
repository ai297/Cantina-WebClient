export const VALIDATION_PATTERNS = {
    email: /^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i,
    nickname: /^[a-zа-я]{2,11}\s?[a-zа-я0-9]{2,11}$/i,
    password: /^.{6,30}$/,
    location: /^([а-я\w\s]{4,32})?$/i,
}

export const MESSAGE_TYPES = {
    Base: {num: 10, name: 'Base', command: '', shortCommand: ''},
    System: {num: 0, name: 'System', command: 'system', shortCommand: '~'},
    Privat: {num: 30, name: 'Privat', command: 'pm', shortCommand: '@'},
    ThirdPerson: {num: 20, name: 'ThirdPerson', command: 'me', shortCommand: '*'},
}

export const GENDER = {
    Uncertain: 0,
    Male: 1,
    Female: 2
}

export const ONLINE_STATUS = {
    HIDDEN: 0,      // невидим
    ONLINE: 1,      // в сети
    ABSENTEE: 2,    // отошёл
}

export const ROUTING = {
    IN_PAGE: '/chat',
    OUT_PAGE: '/'
} 

export const API_URL = {
    ROOT: 'http://localhost:5000/',
    PING: 'ping',
    LOGIN: 'auth',
    REGISTER: 'register',
    ACTIVATION: 'activation',
    userinfo: 'userinfo',
    HUB: 'hub',
    ONLINE_USERS: 'onlineusers',
};

export const ROLES = {
    ADMIN: "Admin",
    USER: "User",
}

export const CLAIMS = {
    ID: "uid",
    EMAIL: "eml",
    ROLE: "ut",
}

export const CHAT_COMMANDS = {
    // методы клиента
    RECEIVE_MESSAGE: 'ReceiveMessage',
    RUN_CONNAND: 'RunCommand',
    USER_ENTER: 'AddUserToOnlineList',
    USER_EXIT: 'RemoveUserFromOnlineList',
    // управление клиентом
    ACTION_ADD_NAME_TO_MESSAGE: 'AddNameToMessage',
    ACTION_ADD_MESSAGE: 'AddMessage',
    ACTION_EXIT: 'Exit',
    // методы сервера
    SEND_MESSAGE: 'SendMessage',
}