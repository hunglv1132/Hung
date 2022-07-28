$(document).ready(function() {
    loadData();

    // Load dữ liệu cho các combobox
    loadDepartment();

    // Thực hiện gán các sự kiện cho element
    $("#btnAddEmployee").click(function() {
        // Hiển thị form chi tiết
        $("#dlgPopup").show();

        // xóa dữ liệu cũ
        $("input").val(null);

        // Lấy mã nhân viên mới và hiển thi lên ô nhập mã nhân viên
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function(response) {
                $("#txtEmployeeCode").val(response);
                // Focus vào ô nhập liệu đầu tiên
                $("#txtEmployeeCode").focus();
            },
        });
    });

    $("#btnSave").click(function() {
        // Thu thập các thông tin đã nhập
        const employeeCode = $("#txtEmployeeCode").val();
        const fullName = $("#txtFullName").val();
        const dateOfBirth = $("#dateOfBirth").val();
        const gender = $("#cbGender").data("value");
        const address = $("#txtAddress").val();
        const email = $("#txtEmail").val();
        const phoneNumber = $("#txtPhoneNumber").val();
        const departmentId = $("#cbDepartment").data("value");
        const salary = $("#numSalary").val();
        // Build thành object nhân viên
        let employee = {
            EmployeeCode: employeeCode,
            FullName: fullName,
            Gender: gender,
            DateOfBirth: dateOfBirth,
            PhoneNumber: phoneNumber,
            Email: email,
            Address: address,
            Salary: salary,
            DepartmentId: departmentId,
        };
        // Gọi API post
        $.ajax({
            type: "POST",
            url: "http://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            async: false,
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        // Ẩn form
        $("#dlgPopup").hide();
        // Hiển thị toast message success
        $("#toastMsg").show();
        setTimeout(function() {
            $("#toastMsg").hide()
        }, 2000);
        // Load lại dữ liệu
        loadData();
    });

    $("#btnCloseDialog").click(function() {
        $("#dlgPopup").hide();
    });
    $("#btnCancel").click(function() {
        $("#dlgPopup").hide();
    });
});

function showLoading() {
    $(".t-loading").show();
}

function loadData() {
    // Làm sạch bảng
    $("#tblEmployee tbody").empty();

    // Lấy dữ liệu
    // Gọi API lấy dữ liệu trên server -> sử dụng jquery Ajax
    let employees = [];

    $(".t-loading").show();

    $.ajax({
        type: "get",
        url: "http://cukcuk.manhnv.net/api/v1/Employees",
        // data: "data", // Tham sô truyền lên cho API
        // dataType: "json",
        // contentType: "application/json",
        async: false,
        success: function(response) {
            employees = response;
            // Build table
            $.each(employees, function(index, employee) {
                let employeeCode = employee.EmployeeCode;
                let fullName = employee.FullName;
                let genderName = employee.GenderName;
                let dateOfBirth = employee.DateOfBirth;
                let salary = employee.Salary;
                let email = employee.Email;
                let phoneNumber = employee.PhoneNumber;
                let department = employee.DepartmentName;

                // Xử lí/ Định dạng dữ liệu

                // Định dạng ngày tháng: Phải có dạng hiển thị là DD/mm/YYYY
                dateOfBirth = new Date(dateOfBirth);
                let date = dateOfBirth.getDate();
                date = date < 10 ? `0${date}` : date;
                let month = dateOfBirth.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;
                let year = dateOfBirth.getFullYear();
                dateOfBirth = `${date}/${month}/${year}`;

                // Định dạng tiền:
                salary = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(salary);

                let tr = `<tr>
                            <td class="text-align-left">${employeeCode}</td>
                            <td class="text-align-left">${fullName}</td>
                            <td class="text-align-left">${genderName || ""}</td>
                            <td class="text-align-center">${dateOfBirth || ""}</td>
                            <td class="text-align-left">${phoneNumber || ""}</td>
                            <td class="text-align-left">${email || ""}</td>
                            <td class="text-align-left">${department || ""}</td>
                            <td class="text-align-right">${salary}</td>
                        </tr>`;
                $("#tblEmployee tbody").append(tr);
            });
            $(".t-loading").hide();
        },
        error: function(error) {
            console.log(error);
        },
    });
}

/**
 * Load dữ liệu cho combobox phòng ban
 * Created by: Hoàng Minh Trí (12/11/2021)
 */

function loadDepartment() {
    // Lấy dữ liệu về
    $.ajax({
        type: "GET",
        url: "http://cukcuk.manhnv.net/api/v1/Departments",
        success: function(response) {
            // Build combobox
            for (const department of response) {
                // let optionHTML = `<option value="${department.DepartmentId}">${department.DepartmentName}</option>`;
                let optionHTML = `<div class="t-combobox-item" value="${department.DepartmentId}">${department.DepartmentName}</div>`
                $("#cbDepartment .t-combobox-data").append(optionHTML);
                let itemDataElement = $("#cbDepartment").find(".t-combobox-data").html();
                $("#cbDepartment").data("itemDataElement", itemDataElement);
            }
        },
    });
}