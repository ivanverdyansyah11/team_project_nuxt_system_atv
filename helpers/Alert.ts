import Cookies from "js-cookie";

export function setAlert(message: string, page: string): void {
    Cookies.set('alert-message', message);
    Cookies.set('alert-page', page);
}