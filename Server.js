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

app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));