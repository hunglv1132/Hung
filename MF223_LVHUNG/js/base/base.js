class BasePage {
    TableId = null;
    Api = null;

    constructor(tableId, api) {
        this.TableId = tableId;
        this.Api = api;
        this.loadData();
    };

    loadData() {
        let tableId = this.TableId;
        // Làm sạch bảng
        $(`table#${tableId} tbody`).empty();
        // Lấy entityId để xác định khóa chính cảu các bản ghi trong bảng
        let entityId = $(`table#${tableId} tbody`).attr('entityId')

        // Lấy dữ liệu
        // Gọi API lấy dữ liệu trên server -> sử dụng jquery Ajax
        let entities = [];

        $(".vh-loading").show();

        $.ajax({
            type: "GET",
            url: this.Api,
            async: false,
            success: function(response) {
                entities = response;
                // Duyệt các cột của table để biết có bao nhiêu cột dữ liệu
                let ths = $(`table#${tableId} thead th`);
                // Build table
                for (const entity of entities) {
                    let trHTML = $(`<tr></tr>`);
                    // Build từng td và gắn giá trị tương ứng với các cột:
                    for (const th of ths) {
                        // Build td HTML để append cho trHTMl
                        let tdHTML = $(`<td></td>`);
                        // Lấy thông tin trường dữ liệu tương ứng với đối tượng entity (đã được khai báo vào fieldValue trong html)
                        let fieldValue = th.getAttribute('fieldValue')
                        let value = entity[fieldValue];
                        let formatType = th.getAttribute("formatType");
                        switch (formatType) {
                            case "date":
                                tdHTML.addClass('text-align-center');
                                tdHTML.text(CommonJS.formatDate(value));
                                break;
                            case "money":
                                tdHTML.addClass('text-align-right');
                                tdHTML.text(CommonJS.formCurrency(value));
                                break;
                            default:
                                tdHTML.addClass('text-align-left');
                                tdHTML.text(value);
                                break;

                        }
                        // tdHTML = `<td class="text-align-left">${value}</td>`
                        trHTML.append(tdHTML);
                    }
                    // Lưu trữ khóa chính trong dữ liệu hiện tại
                    trHTML.data("entityId", entity[entityId]);
                    trHTML.data("data", entity);
                    $(`table#${tableId} tbody`).append(trHTML);
                };
                $(".vh-loading").hide();
            },
            error: function(error) {
                console.log(error);
            },
        });
    }
}