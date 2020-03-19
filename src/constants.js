export const VALIDATION_PATTERNS = {
    email: /^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i,
    nickname: /^[a-zа-я]{2,11}\s?[a-zа-я0-9]{2,11}$/i,
    password: /^.{6,30}$/,
    location: /^([а-я\w\s]{4,32})?$/i,
}

export const MESSAGE_TYPES = {
    Base: {name: 'Base', command: '', shortCommand: ''},
    System: {name: 'System', command: 'system', shortCommand: '~'},
    Privat: {name: 'Privat', command: 'pm', shortCommand: '@'},
    ThirdPerson: {name: 'ThirdPerson', command: 'me', shortCommand: '*'},
}

export const GENDER = {
    Uncertain: 0,
    Male: 1,
    Female: 2
}

export const MAIN_PAGE = '/chat';

export const API_URL = {
    root: 'http://localhost:5000/',
    ping: 'ping',
    login: 'auth',
    register: 'register',
    activation: 'activation',
    userinfo: 'userinfo',
    hub: 'hub',
};

export const ROLES = {
    property: "ut",
    ADMIN: "Admin",
    USER: "User",
}