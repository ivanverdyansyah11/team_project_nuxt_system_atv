export function formatRupiah(angka: number): string {
    const numberString = angka.toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    return `Rp. ${rupiah}${split[1] ? ',' + split[1] : ',00'}`;
}