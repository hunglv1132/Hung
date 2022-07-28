class Person {
    Name;
    Age;
    constructor() {

    }
    getName() {

    }
}

// Định nghĩa 1 class trong js:
// Đối với việc kế thừa thì bắt buộc trong hàm khởi tạo phải sử dụng lệnh super
class Employee extends Person {
    // Trường, thuộc tính (không cần khai báo kiểu dữ liệu)
    FullName;
    GenderName;
    // Hàm khởi tạo: (có thể có tham số đầu vào hoặc không)
    // Khi khởi tạo có thẻ truyền hoặc không truyền đối số đều được
    constructor(name) {
        super();
        // Set các giá trị cho các thành phần trong class 
        this.FullName = name;
        // Có thể gán giá trị cho cả những thuộc tính không được khai báo
        this.SchoolName = "Đại học Bách Khoa Hà Nội";
    }

    /**
     * Khai báo phương thức 
     * Author: Hoàng Minh Trí
     * Created on 19/11/2021
     */
    getName() {
        return this.FullName;
    }

    /**
     * Khai báo một phương thức tính
     * @returns
     * Author: Hoàng Minh Trí
     * Created on 19/11/2021
     */
    static getSchoolName() {
        return "Misa";
    }
}