export const convertToJalali = (date) => {
    let gregorian = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    let jalali = gregorianToJalali(...gregorian);
    let jalaliYear = jalali[0];
    let jalaliMonth = jalali[1];
    let jalaliDay = jalali[2];
    return jalaliYear + '/' + jalaliMonth + '/' + jalaliDay;
}

// This function is taken from https://github.com/decipherinc/persian-date 
const gregorian_months_days = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

const jalali_months_days = [
    [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
    [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30]
];

function gregorianToJalali(gy, gm, gd) {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (gy > 1600) {
        jy = 979;
        gy -= 1600;
    }
    else {
        jy = 0;
        gy -= 621;
    }
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * (parseInt(days / 12053));
    days %= 12053;
    jy += 4 * (parseInt(days / 1461));
    days %= 1461;
    if (days > 365) {
        jy += parseInt((days - 1) / 365);
        days = (days - 1) % 365;
    }
    jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

    var resultY = jy.toString();
    var resultM = jm < 10 ? "0" + jm.toString() : jm.toString();
    var resultD = jd < 10 ? "0" + jd.toString() : jd.toString();
    return [resultY, resultM, resultD];
}