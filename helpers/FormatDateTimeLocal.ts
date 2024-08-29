export function formatDateTimeLocal(dateTimeString) {
    const date = new Date(dateTimeString);

    const padZero = (num) => (num < 10 ? '0' : '') + num;

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear();

    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}