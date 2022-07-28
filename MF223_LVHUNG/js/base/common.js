class CommonJS {
    /**
     * Định dạng hiển thị thông tin (dd/mm/yyyy)
     * @param {Date} date
     * 
     */
    static formatDate(date) {
        if (date) {
            const newDate = new Date(date);
            let day = newDate.getDate();
            day = day < 10 ? `0${day}` : day;
            let month = newDate.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            let year = newDate.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return "";
    };
    /**
     * Định dạng hiển thị tiền tệ 
     * @param {Number} value 
     * @returns 
     * 
     */
    static formatCurrency(value) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };
}