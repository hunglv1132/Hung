$(document).ready(function() {
    // Thực hiện build động tất cả các combobox tự xây dựng
    new Combobox();
    // Khởi tạo sự kiện cho button
    $(".vhcombobox .vh-combobox-button").click(btnComboboxOnClick);
    // $(".vhcombobox .vh-combobox-item").click(itemComboboxOnClick);
    $(".vhcombobox").on("click", ".vh-combobox-item", itemComboboxOnClick);

    $(".vhcombobox input").keyup(inputComboboxOnKeyUp);
    $(".vhcombobox input").keydown(inputComboboxOnkeyDown);
    $(".vhcombobox input").keypress(function(e) {
        console.log("press");
    });

    // Lưu trữ thông tin của combobox data
    let comboboxes = $(".vhcombobox");
    for (const combobox of comboboxes) {
        // Load dữ liệu theo api
        // Kiểm tra xem có khai báo thông tin api lấy dữ liệu hay không?
        const api = combobox.getAttribute("api");
        const propertyDisplay = combobox.getAttribute("propertyDisplay");
        const propertyValue = combobox.getAttribute("propertyValue");
        if (api && propertyDisplay && propertyValue) {
            // Lấy dữ liệu từ api
            $.ajax({
                type: "GET",
                url: api,
                async: false,
                success: function(data) {
                    // Build combobox data
                    for (const item of data) {
                        let text = item[propertyDisplay];
                        let value = item[propertyValue];
                        let itemHTML = `<div class="vh-combobox-item" value="${value}">
                        ${text}
                                        </div>`;
                        $(combobox).find(".vh-combobox-data").append(itemHTML);
                    }
                },
            });
        }
        // Lưu trữ các thông ti ncaanf thiết vào data của combobox
        let itemDataElement = $(combobox).find(".vh-combobox-data").html();
        $(combobox).data("itemDataElement", itemDataElement);
        // $(combobox).find(".vh-combobox-data").empty();
    }

});

class Combobox {
    constructor() {
        this.buildComboboxHTML();
    };

    buildComboboxHTML() {
            // Duyệt tất cả các thẻ là combobox:
            let comboboxes = $("combobox");
            for (const combobox of comboboxes) {
                // Lấy ra các thông tin cần thiết (VD: api lấy dữ liệu, trường thông tin sẽ hiển thị, trường giá trị của từng item)
                const api = combobox.getAttribute("api");
                const propertyDisplay = combobox.getAttribute("propertyDisplay");
                const propertyValue = combobox.getAttribute("propertyValue");
                const id = combobox.getAttribute("id");
                const fieldName = combobox.getAttribute("fieldName");

                // Built HTMl của combobox
                let comboboxHTML = $(`<div vhcombobox id="${id || ``}" class="vhcombobox" fieldName="${fieldName}">
                                    <input type="text" class="vh-combobox vh-combobox-input" />
                                    <button tabindex="-1" class="vh-combobox-button">
                                            <i class="fas fa-chevron-down"></i>
                                        </button>
                                    <div class="vh-combobox-data"></div>
                                </div>`);
                comboboxHTML.data("fieldName", fieldName);
                // Nếu có khai báo các api, trường thông tin của dữ liệu thì build các item
                if (api && propertyDisplay && propertyValue) {
                    // Lấy dữ liệu từ api
                    $.ajax({
                        type: "GET",
                        url: api,
                        async: false,
                        success: function (data) {
                            // Build combobox data
                            for (const item of data) {
                                let text = item[propertyDisplay];
                                let value = item[propertyValue];
                                let itemHTML = `<div class="vh-combobox-item" value="${value}">${text}</div>`;
                                $(comboboxHTML)
                                    .find(".vh-combobox-data")
                                    .append(itemHTML);
                            }
                            $(combobox).replaceWith(comboboxHTML);
                        },
                    });
                } else {
                    // Lấy ra các Node là item
                    let items = $(combobox).children('item');
                    // Thực hiện build từng item data cho combobox
                    for (const item of items) {
                        const text = item.textContent;
                        const value = item.getAttribute('value');
                        const itemHTML = `<div class="vh-combobox-item" value="${value}">${text}</div>`;
                        $(comboboxHTML)
                        .find(".vh-combobox-data")
                        .append(itemHTML);
                    }
                    $(combobox).replaceWith(comboboxHTML);
                }
        }
    }
}

function inputComboboxOnKeyUp() {
    // Loại bỏ một số phím đặc biệt
    switch (event.keyCode) {
        case 13:
        case 40:
        case 38:
            break;
        default:
            let itemDataElement = $(this.parentElement).data("itemDataElement");
            // Build lại html cho các combobox data
            $(this).siblings(".vh-combobox-data").html(itemDataElement);
            // Thực hiện lọc dữ liệu trong combobox data item
            // 1. Lấy value đã nhập trên input
            const valueInput = this.value;
            // 2. Duyệt từng item và thực hiện kiểm tra xem element nào có trùng với value đã nhập
            // Lấy tất cả item element của combobox
            let items = $(this).siblings(".vh-combobox-data").children();

            for (const item of items) {
                let textItem = item.textContent;
                if (
                    !textItem.toLowerCase().includes(valueInput.toLowerCase())
                ) {
                    item.remove();
                }
            }
            $(this).siblings(".vh-combobox-data").show();
            break;
    }
}

function inputComboboxOnkeyDown() {
    // Lấy tất cả item element của combobox
    let items = $(this).siblings(".vh-combobox-data").children();

    // Kiểm tra xem có item nào đã ở trạng thái được hover chưa
    let itemHovered = items.filter(".vh-combobox-item-hover");
    // Bỏ hover tất cả những item đã được set trước đó
    // $(items).removeClass("vh-combobox-item-hover");
    switch (event.keyCode) {
        case 13: // Khi nhán enter
            // Nếu có item nào được chọn thì lấy text -> gán cho input và value -> gán cho combobox
            if (itemHovered.length === 1) {
                itemHovered = itemHovered[0];
                // Hiển thị text ở item vừa chọn lên input của combobox
                // 1 - Lấy text trong item vừa chọn:
                const text = itemHovered.textContent;
                // 2 - Lấy ra value của item vừa chọn:
                const value = itemHovered.getAttribute("value");
                // 3 - Gán text vào input của combobox
                // 3.1 - Lấy ra element cha:
                let parentElement = itemHovered.parentElement;
                // 3.2 - Tìm element input ngang cấp với element cha và thực hiện gán text:
                $(parentElement).siblings("input").val(text);
                // 4 - Gán value cho combobox:
                // 4.1 - Tìm element vhcombobox chứa item hiện tại
                let parentComboboxElement =
                    $(itemHovered).parents(".vhcombobox");
                // Cách 1: Thực hiện lưu value vào attribute của element:
                parentComboboxElement.attr("value", value);
                // Cách 2: Gán vào data của element
                parentComboboxElement.data("value", value);
                // Ẩn combobox data đi
                $(parentElement).hide();
            }
            break;
        case 38: // Nhấn phím mũi tên lên trên bàn phím
            // Nếu chưa item nào được hover thì mặc định focus vào item cuối cùng trong data của combobox
            if (itemHovered.length > 0) {
                let prevElement = itemHovered.prev();
                prevElement.addClass("vh-combobox-item-hover");
                itemHovered.removeClass("vh-combobox-item-hover");
            } else {
                let lastItem = items[items.length - 1];
                lastItem.classList.add("vh-combobox-item-hover");
            }
            // Hiển thị data của combobox hiện tại
            $(this).siblings(".vh-combobox-data").show();
            break;
        case 40: // Nhấn phím mũi tên xuống trên bàn phím
            // Nếu đã có item được hover trước đó thì hover tới item kế tiếp
            if (itemHovered.length > 0) {
                // Lấy element kế tiếp
                let nextElement = itemHovered.next();
                // Thêm class hover cho item kế tiếp:
                nextElement.addClass("vh-combobox-item-hover");
                // Xóa class hover của item hiện tại
                itemHovered.removeClass("vh-combobox-item-hover");
            } else {
                // Nếu chưa item nào được hover thì mặc định focus vào item đầu tiên trong data của combobox
                // Chọn item đầu tiên
                let firstItem = items[0];
                firstItem.classList.add("vh-combobox-item-hover");
            }
            // Hiển thị data của combobox hiện tại
            $(this).siblings(".vh-combobox-data").show();
            break;
        default:
            break;
    }
}

function btnComboboxOnClick() {
    // Hiển thị combobox dât của chính combobox hiện tại:
    // 1 - Xác định combobox - data của combobox hiện tại:
    let comboboxData = $(this).siblings(".vh-combobox-data");
    // 2 - Hiển thị
    comboboxData.toggle();
}

function itemComboboxOnClick() {
    // Hiển thị text ở item vừa chọn lên input của combobox
    // 1 - Lấy text trong item vừa chọn:
    const text = this.textContent;
    // 2 - Lấy ra value của item vừa chọn:
    const value = this.getAttribute("value");
    // 3 - Gán text vào input của combobox
    // 3.1 - Lấy ra element cha:
    let parentElement = this.parentElement;
    // 3.2 - Tìm element input ngang cấp với element cha và thực hiện gán text:
    $(parentElement).siblings("input").val(text);
    // 4 - Gán value cho combobox:
    // 4.1 - Tìm element vhcombobox chứa item hiện tại
    let parentComboboxElement = $(this).parents(".vhcombobox");
    // Cách 1: Thực hiện lưu value vào attribute của element:
    parentComboboxElement.attr("value", value);
    // Cách 2: Gán vào data của element
    parentComboboxElement.data("value", value);
    // Ẩn combobox data đi
    $(parentElement).hide();
}