# PetShop Project

## 1. Giới thiệu về Project
PetShop là một hệ thống quản lý sản phẩm thú cưng, cung cấp các công cụ tiện lợi để quản lý và theo dõi sản phẩm. Hệ thống hỗ trợ các chức năng như thêm sản phẩm mới, cập nhật thông tin sản phẩm, xóa sản phẩm, và xem danh sách sản phẩm hiện có. Đây là một giải pháp hiệu quả cho các cửa hàng thú cưng để tối ưu hóa quy trình quản lý.

## 2. Project sử dụng công nghệ gì
- **Frontend**: HTML, CSS, JavaScript (client-side).
- **Backend**: Node.js với Express.js.
- **Cơ sở dữ liệu**: MongoDB.
- **API**: RESTful API để giao tiếp giữa client-side và server-side.

## 3. Server
Server được xây dựng bằng Node.js và Express.js, chịu trách nhiệm xử lý các yêu cầu từ client-side. Các chức năng chính của server bao gồm:
- Kết nối với cơ sở dữ liệu MongoDB.
- Cung cấp các API để thêm, cập nhật, xóa và truy vấn sản phẩm.
- Xử lý các tệp JSON được tải lên để nhập dữ liệu sản phẩm.

## 4. Các trang HTML và chức năng

### Trang chủ (`index.html`)
- Hiển thị thông tin giới thiệu về hệ thống.
- Cung cấp các liên kết đến các chức năng chính như xem danh sách sản phẩm, thêm sản phẩm, cập nhật sản phẩm, và xóa sản phẩm.

### Danh sách sản phẩm (`product-list.html`)
- Hiển thị danh sách tất cả các sản phẩm hiện có.
- Cho phép tìm kiếm sản phẩm theo ID, tên, thương hiệu, danh mục, xuất xứ, và khoảng giá.
- Hỗ trợ lọc sản phẩm theo danh mục, xuất xứ, và khoảng giá.
- Cho phép sắp xếp sản phẩm theo các tiêu chí như ID, tên sản phẩm, giá, số lượng, và đánh giá.
- Tích hợp các nút để chỉnh sửa hoặc xóa sản phẩm trực tiếp từ danh sách.
- Hỗ trợ chọn nhiều sản phẩm để thực hiện các thao tác hàng loạt như xóa hoặc cập nhật.
- Giao tiếp với server qua API để lấy danh sách sản phẩm, thực hiện tìm kiếm, lọc, sắp xếp, và các thao tác xóa hoặc cập nhật hàng loạt.

### Thêm sản phẩm (`add-product.html`)
- Cung cấp biểu mẫu để thêm sản phẩm mới.
- Tự động tạo ID sản phẩm dựa trên danh mục.
- Hỗ trợ tải lên hình ảnh sản phẩm.
- Gửi dữ liệu sản phẩm đến server qua API để lưu trữ vào cơ sở dữ liệu.

### Cập nhật sản phẩm (`update-product.html`)
- Hiển thị biểu mẫu để chỉnh sửa thông tin sản phẩm.
- Tải thông tin sản phẩm từ server dựa trên ID sản phẩm.
- Gửi dữ liệu cập nhật đến server qua API.

### Chi tiết sản phẩm (`product-detail.html`)
- Hiển thị thông tin chi tiết của một sản phẩm cụ thể.
- Tải dữ liệu từ server qua API dựa trên ID sản phẩm.
- Hỗ trợ các nút để chỉnh sửa hoặc xóa sản phẩm.

### Xóa sản phẩm (`delete-product.html`)
- Cung cấp giao diện để chọn và xóa sản phẩm.
- Gửi yêu cầu xóa đến server qua API.

## Cấu trúc Project
```
PetShop/
├── Server.js                # File chính của server
├── public/
│   ├── pages/              # Các trang HTML
│   ├── javascripts/        # Các file JavaScript client-side
│   ├── styles/             # Các file CSS
│   └── images/             # Hình ảnh sản phẩm
├── products.json           # Dữ liệu sản phẩm mẫu
├── test_import_products.json # File JSON để nhập dữ liệu sản phẩm
├── package.json            # Thông tin về các package Node.js
└── README.md               # Tài liệu giới thiệu project