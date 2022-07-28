$(document).ready(function() {
    new CustomerPage();
})

class CustomerPage extends BasePage {
    TitlePage = "Danh sách khách hàng";
    constructor() {
        super("tblCustomer", "http://cukcuk.manhnv.net/api/v1/Customerss");
        this.loadData();
    }

    loadData() {
        // Làm sạch bảng
        $("#tblCustomer tbody").empty();

        // Lấy dữ liệu
        // Gọi API lấy dữ liệu trên server -> sử dụng jquery Ajax
        let customers = [];

        // hiển thị loading dữ liệu
        $(".t-loading").show();

        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Customerss",
            // data: "data", // Tham sô truyền lên cho API
            // dataType: "json",
            // contentType: "application/json",
            async: false,
            success: function(response) {
                customers = response;
                // Build table
                for (const customer of customers) {
                    let customerCode = customer.CustomerCode;
                    let fullName = customer.FullName;
                    let genderName = customer.Gender;
                    let dateOfBirth = customer.DateOfBirth;
                    let email = customer.Email;
                    let phoneNumber = customer.PhoneNumber;
                    let address = customer.Address

                    let trHTML = $(`<tr>
                        <td class="text-align-left">${customerCode}</td>
                        <td class="text-align-left">${fullName}</td>
                        <td class="text-align-left">${
                            genderName || ""
                        }</td>
                        <td class="text-align-center">${
                            CommonJS.formatDate(dateOfBirth) ||
                            ""
                        }</td>
                        <td class="text-align-left">${
                            phoneNumber || ""
                        }</td>
                        <td class="text-align-left">${
                            email || ""
                        }</td>
                        <td class="text-align-left">${
                            address || ""
                        }</td>
                    </tr>`);
                    // Lưu trữ khóa chính trong dữ liệu hiện tại
                    trHTML.data("customerId", customer.CustomerId);
                    trHTML.data("data", customer);
                    $("#tblCustomer tbody").append(trHTML);
                };
                $(".t-loading").hide();
            },
            error: function(error) {
                console.log(error);
            },
        });
    }

    initEvents() {

    }

    saveData() {

    }

}