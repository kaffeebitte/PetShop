const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const productsModule = require('./products.js');
let productList = productsModule.products;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/pages')));
app.use(express.static(path.join(__dirname, '/public/images')));

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

app.get('/products', (req, res) => {
    res.json(productList);
});

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

app.get('/products/:id', (req, res) => {
    const product = productList.find(p => p.productId === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
});

app.post('/products', (req, res) => {
    const { productId, title, price, quantity, brand, origin } = req.body;

    if (!productId || !title || !price || !quantity || !brand || !origin) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin sản phẩm.' });
    }

    if (productsModule.findProductById(productId)) {
        return res.status(400).json({ error: 'ID sản phẩm đã tồn tại.' });
    }

    const newProduct = {
        productId,
        title: title.trim(),
        images: [],
        description: { details: req.body.description?.trim() || '' },
        rating: Number(req.body.rating || 0),
        additionalInfo: {
            quantity: Number(quantity),
            price: Number(price),
            brand: brand.trim(),
            origin: origin.trim()
        }
    };

    productsModule.addProduct(productList, newProduct);
    res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', product: newProduct });
});

//cập nhật sp
app.put('/update/product/:id', (req, res) => {
    const productId = req.params.id;
    const productIndex = productList.findIndex(p => p.productId === productId);

    if (productIndex !== -1) {
        let images = productList[productIndex].images; // Giữ nguyên hình ảnh cũ

        // Kiểm tra nếu có hình ảnh mới được tải lên
        if (req.files && req.files.images) {
            const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            const imagePaths = uploadedImages.map(image => {
                const imagePath = `/images/${image.name}`;
                image.mv(path.join(__dirname, 'public', imagePath), err => {
                    if (err) {
                        console.error('Lỗi khi lưu hình ảnh:', err);
                        return res.status(500).json({ error: 'Không thể lưu hình ảnh' });
                    }
                });
                return imagePath;
            });
            images = imagePaths; // Cập nhật danh sách hình ảnh mới
        }

        const updatedProduct = {
            productId: productId,
            title: req.body.title || productList[productIndex].title,
            images: images, // Giữ nguyên hoặc cập nhật hình ảnh
            description: {
                details: req.body.description || productList[productIndex].description.details
            },
            rating: Number(req.body.rating || productList[productIndex].rating),
            additionalInfo: {
                quantity: Number(req.body.quantity || productList[productIndex].additionalInfo.quantity),
                price: Number(req.body.price || productList[productIndex].additionalInfo.price),
                brand: req.body.brand || productList[productIndex].additionalInfo.brand,
                origin: req.body.origin || productList[productIndex].additionalInfo.origin
            }
        };

        productList[productIndex] = updatedProduct;
        console.log(`Đã cập nhật sản phẩm: ${updatedProduct.productId} - ${updatedProduct.title}`);
        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            product: updatedProduct
        });
    } else {
        console.log(`Không tìm thấy sản phẩm với ID: ${productId}`);
        res.status(404).json({
            error: 'Không tìm thấy sản phẩm để cập nhật'
        });
    }
});

//xóa sp
app.delete('/delete/product/:id', (req, res) => {
    const productId = req.params.id;
    const productIndex = productList.findIndex(p => p.productId === productId);

    if (productIndex !== -1) {
        const deletedProduct = productList.splice(productIndex, 1);
        console.log(`Đã xóa sản phẩm: ${deletedProduct[0].productId} - ${deletedProduct[0].title}`);
        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công',
            product: deletedProduct[0]
        });
    } else {
        console.log(`Không tìm thấy sản phẩm với ID: ${productId}`);
        res.status(404).json({
            error: 'Không tìm thấy sản phẩm để xóa'
        });
    }
});

app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));