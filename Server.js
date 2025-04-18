const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'mydatabase';
const collectionName = 'DoDungThuCung';

async function findProductById(productId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return await collection.findOne({ productId: productId });
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm theo ID:", error);
        throw error;
    }
}

async function getUniqueCategories() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const categories = await collection.distinct('category');
        return categories.sort();
    } catch (error) {
        console.error("Error getting categories:", error);
        throw error;
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/pages')));
app.use(express.static(path.join(__dirname, '/public/images')));

app.get('/products', async (req, res) => {
    try{
        await client.connect(); 
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const products = await collection.find({}).toArray();
        res.json(products);
    }
    catch (error) {
        console.error("Lỗi kết nối DB:", error);
        res.status(500).send("Lỗi máy chủ");
    }
});

app.get('/productlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/product-list.html'));
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

app.get('/productdetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/product-detail.html'));
});

app.get('/products', async (req, res) =>{
    try{
        await client.connect(); // ham connect co co che bat dong bo
        console.log("Connected to MongoDB successfully");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const products = await collection.find({}).toArray();
        res.json(products);
    }
    catch (error) {
        console.error("DB connection error: ", error);
        res.status(500).send("Internal Server Error");
    }
});

// tìm kiếm dựa vào id, tên, brand, xuất xứ
app.get('/products/search', (req, res) => {
    const keyword = req.query.keyword?.toLowerCase();
    
    if (!keyword) {
        return res.json(productList);
    }
    
    const filteredProducts = productList.filter(product => 
        product.productId.toLowerCase().includes(keyword) || 
        product.title.toLowerCase().includes(keyword) || 
        (product?.additionalInfo?.brand || '').toLowerCase().includes(keyword) || 
        (product?.additionalInfo?.origin || '').toLowerCase().includes(keyword)
    );
    
    res.json(filteredProducts);
});

//api thêm sản phẩm mới (thêm hình ảnh vào folder images)
app.post('/products', async (req, res) => {
    const { productId, title, price, quantity, brand, origin, category } = req.body; 

    try {
        if (!productId || !title || !price || !quantity || !brand || !origin) {
            return res.status(400).send('Vui lòng điền đầy đủ thông tin sản phẩm.');
        }

        const existingProduct = await findProductById(productId);
        if (existingProduct) {
            return res.status(400).send('ID sản phẩm đã tồn tại.');
        }

        const newProduct = {
            productId,
            title: title.trim(),
            category: category || "Chưa phân loại", 
            images: [],
            description: { details: req.body.description ? req.body.description.trim() : '' },
            rating: req.body.rating ? Number(req.body.rating) : 0,
            additionalInfo: {
                quantity: Number(quantity),
                price: Number(price),
                brand: brand.trim(),
                origin: origin.trim()
            }
        };
        
        if (req.files && req.files.images) {
            const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            
            uploadedImages.forEach((image) => {
                const fileName = image.name; 
                const uploadPath = path.join(__dirname, 'public/images/', fileName);

                image.mv(uploadPath, (err) => {
                    if (err){
                        console.error('Lỗi lưu ảnh:', err);
                    } 
                });
                
                newProduct.images.push(fileName);
            });
        }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(newProduct);

        console.log(`Đã thêm sản phẩm mới (ID: ${newProduct.productId}) vào cơ sở dữ liệu thành công!`);
        res.status(201).send(`Sản phẩm ${newProduct.title} đã được thêm thành công!`);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Lỗi máy chủ: ' + err.message);
    }
});

app.get('/products/:id', (req, res) => {
    const product = productList.find(p => p.productId === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Không tìm thấy sản phẩm');
    }
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

// New endpoint to get all categories
app.get('/categories', (req, res) => {
    const categories = getUniqueCategories();
    res.json(categories);
});

app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));