export function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);

    const padZero = (num) => (num < 10 ? '0' : '') + num;

    const day = padZero(date.getDate());
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()]; // Months are zero-based
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}