const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const productsModule = require('./products.js');
let productList = productsModule.products;

// Cấu hình để phục vụ các file tĩnh trong thư mục "public"
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/pages')));
app.use(express.static(path.join(__dirname, '/public/images')));
app.use(express.json()); // Thêm middleware để xử lý JSON

// Định nghĩa các route để trả về các trang HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html')); 
});

app.get('/add/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/add-product.html')); 
});

app.get('/delete/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/delete-product.html')); 
});

app.get('/update/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/update-product.html')); 
});

app.get('/productlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/product-list.html')); 
});

app.get('/productdetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/product-detail.html')); 
});

// Yêu cầu trả về danh sách sản phẩm
app.get('/products', (req, res) => {
    res.json(productList);
});

// Lấy thông tin chi tiết của một sản phẩm
app.get('/products/:id', (req, res) => {
    const product = productList.find(p => p.productId === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
});

// Route cho trang chi tiết sản phẩm - phải được đặt sau API routes
app.get('/productdetail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/product-detail.html')); 
});

// Route mặc định cho các đường dẫn không hợp lệ
app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

//Cập nhật sản phẩm 

// Khởi chạy server
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}!`));