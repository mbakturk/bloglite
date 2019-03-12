var securePath = location.pathname.split('/')[1];
securePath = "/" + securePath + "/";

function redirect(href) {
    location.href = securePath + href;
}