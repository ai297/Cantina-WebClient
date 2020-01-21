// middleware функция, проверяющая авторизацию
export default async function({next, store, nextMiddleware}){
    if(store.getters["auth/isAuth"]) {              // если авторизован - то идём дальше
        return nextMiddleware();
    } else if(store.getters["auth/canRefresh"]){    // если не авторизован, но есть рефреш-токен - обновляем токены
        await store.dispatch('auth/update');
        if(store.getters["auth/isAuth"]) return nextMiddleware();
        else return next({name: "login", replace: true});
    } else return next({name: "login", replace: true});    // иначе идём на страницу логина
}