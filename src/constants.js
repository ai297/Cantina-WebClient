// шаблоны валидации форм
export const VALIDATION_PATTERNS = {
    email: /^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i,
    nickname: /^[a-zа-я]{2,11}\s?[a-zа-я0-9]{2,11}$/i,
    password: /^.{6,30}$/,
    location: /^([а-я\w\s]{4,32})?$/i,
}

export const MESSAGE_TYPES = {
    Base: 0,
    Privat: 10,
    ThirdPerson: 20,
    System: 100,
    Information: 101,
    Error: 102,
    TYPES: {
        0: { name: 'Base', command: '', shortCommand: ''},
        10: { name: 'Privat', command: 'pm', shortCommand: '#'},
        20: { name: 'ThirdPerson', command: 'me', shortCommand: '*'},
        100: { name: 'System', command: 'system', shortCommand: '~'},
        101: {name: 'Information', command: 'info', shortCommand: null},
        102: {name: "Error", command: 'error', shortCommand: null}
    },
}

export const ROUTING = {
    IN_PAGE: '/chat',
    OUT_PAGE: '/'
} 

export const API_URL = {
    ROOT: 'http://192.168.43.193:5000/',
    LOGIN: 'auth',
    REGISTER: 'register',
    ACTIVATION: 'activation',
    USERINFO: 'userinfo',
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
    ACTION_ADD_MESSAGE: 'AddMessage',
    ACTION_EXIT: 'Exit',
    ACTION_SHOW_SETTINGS: 'ShowUserSettings',
    ACTION_SHOW_SMILES: "ShowSmiles",
    ACTION_SHOW_SMILES_SETTINGS: 'ShowSmilesSettings',
    ACTION_CLOSE_MODAL: 'HideModalView',
    ACTION_CHANGE_SIDEBAR: "ChangeSideBarMode",
    ACTION_FOCUS_INPUT_FIELD: "FocusInputField",
    ACTION_ADD_NAME_TO_MESSAGE: 'AddNameToMessage',
    ACTION_INSERT_SMILE_TO_MESSAGE: 'InsertSmileToMessage',
    ACTION_PLAY_NEW_MESSAGE_SOUND: "PlayNewMessageSound",
    ACTION_SCROLL_TO_LAST_MESSAGE: "ScrollToLastMessage",
    ACTION_SWIPE_PANELS: 'SwipePanels',
    // методы сервера
    SEND_MESSAGE: 'SendMessage',
}

export const MOUNTHS = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
]

export const GENDER = [
    "Нейтральный",
    "Мужской",
    "Женский",
]

export const FONTS = [
    "Стандартный",
    "Arial",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
]

export const COLORS = [
    [0,0,0],
    [225,225,225],
    [192,192,192],
    [210,180,140],
    [255,182,193],
    [127,255,212],
    [117,117,117],
    [47,79,79],

    [220,20,60],
    [178,34,34],
    [255,0,0],
    [255,69,0],
    [139,69,19],
    [139,0,0],
    [255,215,0],
    
    [255,140,0],
    [0,255,0],
    [128,128,0],
    [0,128,0],
    [60,179,113],
    [95,158,160],
    [0,139,139],
    
    [0,191,255],
    [100,149,237],
    [30,144,255],
    [65,105,225],
    [0,0,205],
    [0,0,139],
    [218,112,214],
    
    [255,105,180],
    [255,0,255],
    [255,20,147],
    [148,0,211],
    [139,0,139],
]