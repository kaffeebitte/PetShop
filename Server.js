const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'dsDoDungThuCung';
const collectionName = 'ThuCung';

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
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

// Get all products
app.get('/products', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const products = await collection.find({}).toArray();
        res.json(products);
    } catch (error) {
        console.error("Lỗi kết nối DB:", error);
        res.status(500).send("Lỗi máy chủ");
    }
});

// Search products
app.get('/products/search', async (req, res) => {
    const keyword = req.query.keyword?.toLowerCase();
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        let query = {};
        
        if (keyword) {
            query = {
                $or: [
                    { productId: { $regex: keyword, $options: 'i' } },
                    { title: { $regex: keyword, $options: 'i' } },
                    { 'additionalInfo.brand': { $regex: keyword, $options: 'i' } },
                    { 'additionalInfo.origin': { $regex: keyword, $options: 'i' } }
                ]
            };
        }
        
        const products = await collection.find(query).toArray();
        res.json(products);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        res.status(500).send("Lỗi máy chủ");
    }
});

// Add new product
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
                    if (err) {
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

// Get product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await findProductById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Không tìm thấy sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).send('Lỗi máy chủ');
    }
});

// Update single product
app.put('/update/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const existingProduct = await collection.findOne({ productId: productId });

        if (!existingProduct) {
            console.log(`Không tìm thấy sản phẩm với ID: ${productId}`);
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        let images = existingProduct.images; // Keep existing images

        if (req.files && req.files.images) {
            const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            images = uploadedImages.map(image => {
                const fileName = image.name;
                const uploadPath = path.join(__dirname, 'public/images/', fileName);
                image.mv(uploadPath, err => {
                    if (err) {
                        console.error('Lỗi khi lưu hình ảnh:', err);
                    }
                });
                return fileName;
            });
        }

        const updatedProduct = {
            productId: productId,
            title: req.body.title || existingProduct.title,
            category: req.body.category || existingProduct.category || "Chưa phân loại",
            images: images,
            description: {
                details: req.body.description || existingProduct.description.details
            },
            rating: Number(req.body.rating || existingProduct.rating),
            additionalInfo: {
                quantity: Number(req.body.quantity || existingProduct.additionalInfo.quantity),
                price: Number(req.body.price || existingProduct.additionalInfo.price),
                brand: req.body.brand || existingProduct.additionalInfo.brand,
                origin: req.body.origin || existingProduct.additionalInfo.origin
            }
        };

        await collection.updateOne(
            { productId: productId },
            { $set: updatedProduct }
        );

        console.log(`Đã cập nhật sản phẩm: ${updatedProduct.productId} - ${updatedProduct.title}`);
        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Update multiple products
app.put('/update/products', async (req, res) => {
    const { productIds, updates } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Danh sách productIds không hợp lệ hoặc rỗng' });
    }

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Không có trường nào được cung cấp để cập nhật' });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Build the update object for MongoDB
        const updateFields = {};
        if (updates.category) {
            updateFields.category = updates.category.trim();
        }
        if (updates.price !== undefined) {
            updateFields['additionalInfo.price'] = Number(updates.price);
        }
        if (updates.quantity !== undefined) {
            updateFields['additionalInfo.quantity'] = Number(updates.quantity);
        }
        if (updates.brand) {
            updateFields['additionalInfo.brand'] = updates.brand.trim();
        }
        if (updates.origin) {
            updateFields['additionalInfo.origin'] = updates.origin.trim();
        }
        if (updates.rating !== undefined) {
            updateFields.rating = Number(updates.rating);
        }
        if (updates.description !== undefined) {
            updateFields['description.details'] = updates.description.trim();
        }

        const result = await collection.updateMany(
            { productId: { $in: productIds } },
            { $set: updateFields }
        );

        if (result.matchedCount > 0) {
            console.log(`Đã cập nhật ${result.modifiedCount} sản phẩm với IDs: ${productIds.join(', ')}`);
            res.json({
                success: true,
                message: `Cập nhật ${result.modifiedCount} sản phẩm thành công`,
                modifiedCount: result.modifiedCount
            });
        } else {
            console.log(`Không tìm thấy sản phẩm nào với IDs: ${productIds.join(', ')}`);
            res.status(404).json({ error: 'Không tìm thấy sản phẩm nào để cập nhật' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật nhiều sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Delete single product
app.delete('/delete/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ productId: productId });

        if (result.deletedCount === 1) {
            console.log(`Đã xóa sản phẩm với ID: ${productId}`);
            res.json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } else {
            console.log(`Không tìm thấy sản phẩm với ID: ${productId}`);
            res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Delete multiple products
app.delete('/delete/products', async (req, res) => {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Danh sách productIds không hợp lệ hoặc rỗng' });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany({ productId: { $in: productIds } });

        if (result.deletedCount > 0) {
            console.log(`Đã xóa ${result.deletedCount} sản phẩm với IDs: ${productIds.join(', ')}`);
            res.json({
                success: true,
                message: `Xóa ${result.deletedCount} sản phẩm thành công`,
                deletedCount: result.deletedCount
            });
        } else {
            console.log(`Không tìm thấy sản phẩm nào với IDs: ${productIds.join(', ')}`);
            res.status(404).json({ error: 'Không tìm thấy sản phẩm nào để xóa' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa nhiều sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Get all categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await getUniqueCategories();
        res.json(categories);
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).send('Lỗi máy chủ');
    }
});

app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));