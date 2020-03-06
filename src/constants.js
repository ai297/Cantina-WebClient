export const VALIDATION_PATTERNS = {
    email: /^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i,
    nickname: /^[a-zа-я]{2,11}\s?[a-zа-я0-9]{2,11}$/i,
    password: /^.{6,30}$/,
    location: /^([а-я\w\s]{4,32})?$/i,
}

export const MESSAGE_TYPES = {
    base: {name: 'base', command: '', shortCommand: ''},
    system: {name: 'system', command: 'system', shortCommand: '~'},
    privat: {name: 'privat', command: 'pm', shortCommand: '@'},
    thirdPerson: {name: 'thirdPerson', command: 'me', shortCommand: '*'},
}

export const GENDER = {
    Uncertain: 0,
    Male: 1,
    Female: 2
}

export const MAIN_PAGE = '/chat';