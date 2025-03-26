const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const productsModule = require('./products.js');
let productList = productsModule.products;

// Thêm middleware body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Yêu cầu trả về danh sách sản phẩm
app.get('/products', (req, res) => {
    res.json(productList);
});

// Tìm kiếm sản phẩm 
app.get('/products/search', (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase().trim() : '';
    
    console.log(`Nhận yêu cầu tìm kiếm với từ khóa: "${keyword}"`);
    
    if (!keyword) {
        console.log('Không có từ khóa được cung cấp, trả về tất cả sản phẩm');
        return res.json(productList);
    }
    
    const results = productList.filter(product => 
        product.title.toLowerCase().includes(keyword) ||
        (product?.additionalInfo?.brand || '').toLowerCase().includes(keyword) ||
        (product?.additionalInfo?.origin || '').toLowerCase().includes(keyword) ||
        (product?.category || '').toLowerCase().includes(keyword)
    );
    
    console.log(`Tìm thấy ${results.length} sản phẩm khớp với từ khóa "${keyword}"`);
    res.json(results);
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

// Thêm sản phẩm mới
app.post('/products', (req, res) => {
    try {
        // Kiểm tra các trường bắt buộc
        const requiredFields = ['productId', 'title', 'price', 'quantity', 'brand', 'origin'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            console.log(`Thiếu thông tin bắt buộc: ${missingFields.join(', ')}`);
            return res.status(400).json({
                error: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`
            });
        }

        // Tạo đối tượng sản phẩm mới với các trường bắt buộc
        const newProduct = {
            productId: req.body.productId,
            title: req.body.title.trim(),
            images: [],
            description: {
                details: req.body.description?.trim() || ''
            },
            rating: Number(req.body.rating || 0),
            additionalInfo: {
                quantity: Number(req.body.quantity),
                price: Number(req.body.price),
                brand: req.body.brand.trim(),
                origin: req.body.origin.trim()
            }
        };

        // Thêm thông tin QnA nếu có
        if (req.body['questions[]'] && req.body['answers[]']) {
            const questions = Array.isArray(req.body['questions[]']) ? 
                            req.body['questions[]'] : [req.body['questions[]']];
            const answers = Array.isArray(req.body['answers[]']) ? 
                          req.body['answers[]'] : [req.body['answers[]']];

            const validQnAs = questions
                .map((q, i) => ({
                    question: q?.trim(),
                    answer: answers[i]?.trim()
                }))
                .filter(qa => qa.question && qa.answer);

            if (validQnAs.length > 0) {
                newProduct.QnA = validQnAs;
            }
        }

        productsModule.addProduct(productList, newProduct);
        console.log(`Đã thêm sản phẩm mới: ${newProduct.productId} - ${newProduct.title}`);
        res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            product: newProduct
        });
    } catch (error) {
        console.error('Lỗi hệ thống:', error);
        res.status(500).json({
            error: 'Đã xảy ra lỗi khi thêm sản phẩm'
        });
    }
});

// Route mặc định cho các đường dẫn không hợp lệ
app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

//Cập nhật sản phẩm 

// Khởi chạy server
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}!`));