export const getLangy = (st) => {
    if (!st) return 'تعیین نشده'
    if (typeof st == 'string') return st
    const lang = localStorage.getItem('lang') ?? 0
    return st[lang];
}