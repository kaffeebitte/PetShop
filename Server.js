const express = require('express')
const path = require('path');
const app = express()
const port = 3000

// Cấu hình để phục vụ các file tĩnh trong thư mục "public"
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/pages')));
app.use(express.static(path.join(__dirname, '/public/images')));

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

// Route mặc định cho các đường dẫn không hợp lệ
app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

//Cập nhật sản phẩm 


// Khởi chạy server
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}!`))