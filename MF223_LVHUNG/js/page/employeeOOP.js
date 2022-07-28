$(document).ready(function() {
    new EmployeePage();
});

class EmployeePage {
    TitlePage = "Danh sách khách hàng";
    FormMode = null;
    EmployeeIdSelected = null;
    CurrentPageIndex = 1;
    MaxPageIndex = 1;
    constructor() {
            this.loadData();
            this.initEvents();
        }
        /**
         * Thực hiện load dữ liệu
         * Created by Hoàng Minh Trí on 19/11/2021
         */
    loadData() {
            // Clear dữ liệu cũ
            $("#tblEmployee tbody").empty();

            var employees = [];
            var data = [];

            // Lấy các thông tin thực hiện phân trang
            let searchText = $("#txtSearch").val() || "";
            searchText = searchText ? searchText : "";
            let pageSize = $("#cbPageSize").val();
            let pageNumber = 1;
            let apiUrl = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${searchText}`;
            // gọi api thực hiện phân trang

            // Gọi api thực hiện lấy dữ liệu
            $.ajax({
                type: "GET",
                url: apiUrl,
                async: false,
                success: function(response) {
                    data = response;
                },
                error: function(response) {
                    console.log(response);
                },
            });

            employees = data.Data;
            console.log("data", data);
            // Thực hiện tính toán các số liệu để hiển thị trên giao diện: Tổng số bản ghi, thông tin index bản ghi
            const totalRecord = data.TotalRecord; // Tổng số bản ghi
            const totalPage = data.TotalPage;
            $("#totalRecord").text(totalRecord);

            // Tính toán việc hiển thị số trang trong Paging Bar
            // Kiểm tra tổng số trang hiển thị
            // Nếu tổng số trang lớn hơn số button trang hiển thị trên giao diện -> render ra 5 button
            // Nếu nhỏ hơn -> render ra từng đấy button
            $(".t-table-paging .t-paging-number").empty();
            if (this.MaxPageIndex < totalPage) {
                // Lấy thông tin trang hiện tại
                let currentPageIndex = this.CurrentPageIndex;
                // Xác định phạm vi của trang hiện tại
                let totalRange =
                    Number.parseInt(totalPage / pageSize) +
                    (totalPage % pageSize > 0 ? 1 : 0);
                let currentRange = 0;
                if (currentPageIndex % this.MaxPageIndex !== 0) {
                    currentRange =
                        Number.parseInt(currentPageIndex / this.MaxPageIndex) + 1;
                } else {
                    currentRange = Number.parseInt(
                        currentPageIndex / this.MaxPageIndex
                    );
                }
                // Xác định button bắt đầu bằng trang số bao nhiêu
                let endButton = currentRange * this.MaxPageIndex;
                for (let index = 0; index < this.MaxPageInDex; index++) {
                    let buttonHTML = $(`<div class="page-number">${endButton}</div>`);
                    buttonHTML.data('value', endButton);
                    if (endButton <= totalPage) {
                        if (this.CurrentPageIndex === endButton) {
                            buttonHTML.classList.add('page-number--selected');
                        }
                        $(".t-table-paging .t-paging-number").prepend(buttonHTML);
                    }
                    endButton--;
                }
            } else {
                for (let index = 0; index < totalPage; index++) {
                    let buttonHTML = `<div class="page-number">${index + 1}</div>`;
                    $(".t-table-paging .t-paging-number").prepend(buttonHTML);
                    // endButton--;
                }
            }

            // Build dữ liệu hiện thị lên table
            // Build từng tr và append và tbody
            if (employees && Array.isArray(employees)) {
                for (const employee of employees) {
                    let employeeCode = employee.EmployeeCode;
                    let fullName = employee.EmployeeName;
                    let genderName = employee.GenderName;
                    let dateOfBirth = employee.DateOfBirth;
                    let salary = employee.Salary;
                    let email = employee.Email;
                    let phoneNumber = employee.PhoneNumber;
                    let department = employee.DepartmentName;

                    let trHTML = $(`<tr>
                            <td class="text-align-left">${employeeCode}</td>
                            <td class="text-align-left">${fullName}</td>
                            <td class="text-align-left">${genderName || ""}</td>
                            <td class="text-align-center">${
                                CommonJS.formatDate(dateOfBirth) || ""
                            }</td>
                            <td class="text-align-left">${
                                phoneNumber || ""
                            }</td>
                            <td class="text-align-left">${email || ""}</td>
                            <td class="text-align-left">${department || ""}</td>
                            <td class="text-align-right">${CommonJS.formatCurrency(
                                salary
                            )}</td>
                        </tr>`);
                    // Lưu trữ khóa chính trong dữ liệu hiện tại
                    trHTML.data("employeeId", employee.EmployeeId);
                    trHTML.data("data", employee);
                    $("#tblEmployee tbody").append(trHTML);
                }
            }
        }
        /**
         * Gán sự kiện cho các thành phần có trong trang
         * Created by Hoàng Minh Trí on 19/11/2021
         */
    initEvents() {
        // Button Add
        const _this = this;
        $("#btnAddEmployee").click(this.btnAddOnClick.bind(this));
        // Button Save
        $("#btnSave").click(this.saveData.bind(this));
        // Row on click
        $("#tblEmployee tbody").on("click", "tr", this.rowOnClick.bind(this));
        // Button Delete
        $("#btnDelete").click(this.delete.bind(this));
        // Button Cancel
        $("#btnCloseDialog").click(this.btnCloseDialogOnClick);
        $("#btnCancel").click(this.btnCloseDialogOnClick);
        // Row double click
        $("#tblEmployee tbody").on(
            "dblclick",
            "tr",
            this.rowOnDbClick.bind(this)
        );
        // Input search
        $("#txtSearch").on("blur", function() {
            console.log(this.value);
            _this.loadData();
        });

        $(".t-paging-next").click(function(e) {
            let currentButtonActive = $(this).siblings('.t-paging-number').children('.page-number--selected');
            $(currentButtonActive).removeClass('page-number--selected');
            $(currentButtonActive).next().addClass('page-number--selected');
        })


    }

    /**
     * Hiển thị form thông tin nhân viên chi tiết khi nhấn đúp chuột vào 1 dòng dữ liệu
     * Created by Hoàng Minh Trí 19/11/2021
     */
    rowOnDbClick(sender) {
            this.FormMode = Enum.FormMode.Update;
            let currentRow = sender.currentTarget;
            let employeeId = $(currentRow).data("employeeId");
            this.EmployeeIdSelected = employeeId;
            $.ajax({
                type: "GET",
                url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,
                success: function(response) {
                    console.log(response);
                    // Binding dữ liệu vào form
                    // 1 - Lấy toàn bộ các input đã binding dữ liệu -> có attribute [fieldName]
                    let inputs = $("input[fieldName]");
                    // 2 - Duyệt từng input -> lấy ra giá trị của attribute [fieldName] -> để biết được sẽ map thông tin nào của đối tượng
                    for (const input of inputs) {
                        let fieldName = input.getAttribute("fieldName");
                        let value = response[fieldName];
                        if (value) {
                            input.value = value;
                        } else {
                            input.value = "";
                        }
                    }
                },
            });
            // Hiển thị form chi tiết
            $("#dlgPopup").show();
        }
        /**
         * Click chọn 1 hàng trong table
         * @param {Event} sender
         * Created by Hoàng Minh Trí on 19/11/2021
         */
    rowOnClick(sender) {
        let currentRow = sender.currentTarget;
        let employeeId = $(currentRow).data("employeeId");
        this.EmployeeIdSelected = employeeId;
        $(currentRow).siblings().removeClass("t-row-selected");
        currentRow.classList.add("t-row-selected");
    }

    /**
     * Hiển thị form thêm mới nhân viên khi nhấn vào button add
     * Created by Hoàng Minh Trí on 19/11/2021
     */
    btnAddOnClick() {
            // Gán lại giá trị cho FormMode
            this.FormMode = Enum.FormMode.Add;
            // Clean các giá trị đã được nhập trước đó
            $("input").val(null);
            // Load mã nhân viên mới cho dialog chi tiết
            $.ajax({
                type: "GET",
                url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
                success: function(response) {
                    $("#txtEmployeeCode").val(response);
                    // Focus vào ô nhập liệu đầu tiên
                    $("#txtEmployeeCode").focus();
                },
            });
            // console.log("add");
            // Hiển thị form thêm nhân viên mới
            $("#dlgPopup").show();
        }
        /**
         * Close dialog
         * Created by Hoàng Minh Trí on 19/11/2021
         */
    btnCloseDialogOnClick() {
            $("#dlgPopup").hide();
        }
        /**
         * Save form thêm mới hoặc update
         * Created by Hoàng Minh Trí on 19/11/2021
         */
    saveData() {
            var me = this;
            // Validate dữ liệu - Kiểm tra dữ liệu có hợp lệ hay không

            // Thực hiện build object chi tiết thông tin khách hàng
            // 1 - Lấy toàn bộ các input đã binding dữ liệu -> có attribute [fieldName]
            let inputs = $("input[fieldName]");
            // 2 - Duyệt từng input -> lấy ra giá trị của attribute [fieldName] -> để biết được sẽ map thông tin nào của đối tượng
            let employee = {};
            for (const input of inputs) {
                let fieldName = input.getAttribute("fieldName");
                let value = input.value;
                if (value) {
                    employee[fieldName] = value;
                }
            }
            // Duyệt các combobox:
            let comboboxes = $("#dlgPopup div[tcombobox]");
            // Duyệt từng thằng combobox, thực hiện lấy dữ liệu
            for (const combobox of comboboxes) {
                const value = combobox.getAttribute("value");
                const fieldName = $(combobox).data("fieldName");
                if (fieldName) {
                    employee[fieldName] = value;
                }
            }

            // Thực hiện cất dữ liệu -> Cần kiểm tra xem form ở trạng thái thêm mới hay update để gọi api tương ứng
            if (this.FormMode === Enum.FormMode.Add) {
                $.ajax({
                    type: "POST",
                    url: "http://cukcuk.manhnv.net/api/v1/Employees",
                    data: JSON.stringify(employee),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(response) {
                        // Load lại dữ liệu
                        me.loadData();
                        // Ẩn form chi tiết
                        $("#dlgPopup").hide();
                    },
                });
            } else {
                $.ajax({
                    type: "PUT",
                    url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
                    data: JSON.stringify(employee),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(response) {
                        // Load lại dữ liệu
                        me.loadData();
                        // Ẩn form chi tiết
                        $("#dlgPopup").hide();
                    },
                });
            }
        }
        /**
         * Xóa data
         * @param {event} sender
         * Created by Hoàng Minh Trí on 19/11/2021
         */
    delete(sender) {
        let _this = this;
        // Lấy ra id của bản ghi vừa chọn
        let employeeId = this.EmployeeIdSelected;
        // Gọi api thực hiện xóa
        $.ajax({
            type: "DELETE",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
            success: function(response) {
                _this.loadData();
                // Hiển thị toast message success
                $("#toastMsg").show();
                setTimeout(function() {
                    $("#toastMsg").fadeOut();
                }, 2000);
            },
        });
    }
}