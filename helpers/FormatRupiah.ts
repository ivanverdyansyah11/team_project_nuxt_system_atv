export function formatRupiah(amount: number): string {
    const numberString = amount.toString();
    const split = numberString.split(',');
    const remainder = split[0].length % 3;
    let rupiah = split[0].substr(0, remainder);
    const thousands = split[0].substr(remainder).match(/\d{3}/g);

    if (thousands) {
        const separator = remainder ? '.' : '';
        rupiah += separator + thousands.join('.');
    }

    return `Rp. ${rupiah}${split[1] ? ',' + split[1] : ',00'}`;
}