
// Hàm định dạng tiền 
export const formatCurrency = (value, locale = 'vi-VN', currency = 'VND') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(value);
};