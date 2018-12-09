var securityPath = location.pathname.split('/')[1];
securityPath = "/" + securityPath + "/";

function redirect(href) {
    location.href = securityPath + href;
}