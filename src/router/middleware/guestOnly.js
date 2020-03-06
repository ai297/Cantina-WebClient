import {MAIN_PAGE} from '../../constants.js';
// middleware функция, проверяющая отсутствие авторизацию
export default async function({next, store, nextMiddleware}){
    if(!store.getters["auth/isAuth"] && !store.getters["auth/canRefresh"]) {    // если не авторизован - то идём дальше
        return nextMiddleware();
    } else return next(MAIN_PAGE);
}