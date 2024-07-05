import Cookies from "js-cookie";

export function setAlert(message: string, page: string) {
    Cookies.set('alert-message', message);
    Cookies.set('alert-page', page);
}

export function resetAlert() {
    Cookies.remove('alert-message');
    Cookies.remove('alert-page');
}