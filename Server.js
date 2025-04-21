const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { connectDB, getCollection, dbName } = require('./public/javascripts/mongodb');
const app = express();
const port = 3000;

connectDB().then(() => {
    console.log(`Cơ sở dữ liệu ${dbName} đã sẵn sàng.`);
}).catch(err => {
    console.error("Không thể kết nối đến cơ sở dữ liệu khi khởi động:", err);
    process.exit(1);
});

const categoryPrefixes = {
    'Thức ăn': 'FOOD',
    'Phụ kiện': 'ACCE',
    'Đồ chơi': 'TOYS',
    'Vệ sinh': 'CARE',
    'Quần áo': 'CLTH',
    'Chuồng': 'CAGE',
    'Vận chuyển': 'TRAN'
};

function isValidProductId(productId) {
    if (!productId || typeof productId !== 'string') {
        return false;
    }

    const validPrefixes = Object.values(categoryPrefixes);
    const match = productId.match(/^([A-Z]+)(\d{4})$/);
    if (!match) return false;
    return validPrefixes.includes(match[1]);
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

app.get('/products', async (req, res) => {
    try {
        const collection = getCollection();
        const products = await collection.find({}).toArray();
        res.json(products);
    } catch (error) {
        console.error("Lỗi kết nối cơ sở dữ liệu:", error);
        res.status(500).send("Lỗi máy chủ");
    }
});

app.get('/products/search', async (req, res) => {
    try {
        const collection = getCollection();
        const query = {};
        const conditions = [];

        const productId = req.query.productId?.trim();
        if (productId) {
            conditions.push({ productId: { $regex: productId, $options: 'i' } });
        }

        const productName = req.query.productName?.trim();
        if (productName) {
            conditions.push({ title: { $regex: productName, $options: 'i' } });
        }

        const brand = req.query.brand?.trim();
        if (brand) {
            conditions.push({ 'additionalInfo.brand': { $regex: brand, $options: 'i' } });
        }

        const categories = req.query.categories ?
            (Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]) :
            [];
        if (categories.length > 0) {
            conditions.push({ category: { $in: categories } });
        }

        const origins = req.query.origins ?
            (Array.isArray(req.query.origins) ? req.query.origins : [req.query.origins]) :
            [];
        if (origins.length > 0) {
            conditions.push({ 'additionalInfo.origin': { $in: origins } });
        }

        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

        if (minPrice !== null || maxPrice !== null) {
            const priceCondition = {};
            if (minPrice !== null) {
                priceCondition.$gte = minPrice;
            }
            if (maxPrice !== null) {
                priceCondition.$lte = maxPrice;
            }
            conditions.push({ 'additionalInfo.price': priceCondition });
        }

        const priceRanges = req.query.priceRanges ?
            (Array.isArray(req.query.priceRanges) ? req.query.priceRanges : [req.query.priceRanges]) :
            [];

        if (priceRanges.length > 0) {
            const priceRangeConditions = [];

            priceRanges.forEach(range => {
                const [min, max] = range.split('-').map(val => val ? Number(val) : null);

                if (min !== null && max !== null) {
                    priceRangeConditions.push({ 'additionalInfo.price': { $gte: min, $lte: max } });
                } else if (min !== null) {
                    priceRangeConditions.push({ 'additionalInfo.price': { $gte: min } });
                } else if (max !== null) {
                    priceRangeConditions.push({ 'additionalInfo.price': { $lte: max } });
                }
            });

            if (priceRangeConditions.length > 0) {
                conditions.push({ $or: priceRangeConditions });
            }
        }

        if (conditions.length > 0) {
            query.$and = conditions;
        }

        console.log('Search query:', JSON.stringify(query, null, 2));

        const products = await collection.find(query).toArray();
        res.json(products);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const collection = getCollection();
        const product = await collection.findOne({ productId: req.params.id });
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

app.get('/categories', async (req, res) => {
    try {
        const collection = getCollection();
        const categories = await collection.distinct('category');
        res.json(categories.sort());
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).send('Lỗi máy chủ');
    }
});

app.post('/products', async (req, res) => {
    const { productId, title, price, quantity, brand, origin, category } = req.body;

    try {
        if (!productId || !title || !price || !quantity || !brand || !origin) {
            return res.status(400).send('Vui lòng điền đầy đủ thông tin sản phẩm.');
        }

        const collection = getCollection();
        const existingProduct = await collection.findOne({ productId: productId });
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

        await collection.insertOne(newProduct);

        console.log(`Đã thêm sản phẩm mới (ID: ${newProduct.productId}) vào cơ sở dữ liệu thành công!`);
        res.status(201).send(`Sản phẩm ${newProduct.title} đã được thêm thành công!`);
    } catch (err) {
        console.error('Lỗi máy chủ:', err);
        res.status(500).send('Lỗi máy chủ: ' + err.message);
    }
});

app.post('/import/products/json', async (req, res) => {
    try {
        const jsonData = req.body;

        if (!jsonData) {
            return res.status(400).json({
                success: false,
                error: 'Không có dữ liệu JSON'
            });
        }

        let productsToImport = [];

        if (Array.isArray(jsonData)) {
            productsToImport = jsonData;
            console.log(`Đã phát hiện mảng trực tiếp với ${jsonData.length} sản phẩm`);
        } else if (jsonData && jsonData.products && Array.isArray(jsonData.products)) {
            productsToImport = jsonData.products;
            console.log(`Đã phát hiện đối tượng với mảng products chứa ${jsonData.products.length} sản phẩm`);
        } else if (typeof jsonData === 'object' && jsonData !== null) {
            productsToImport = [jsonData];
            console.log('Đã phát hiện một đối tượng sản phẩm duy nhất');
        } else {
            console.error('Cấu trúc JSON không hợp lệ:', JSON.stringify(jsonData).substring(0, 100) + '...');
            return res.status(400).json({
                success: false,
                error: 'File JSON không đúng định dạng. Vui lòng kiểm tra và thử lại.'
            });
        }

        if (productsToImport.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Không có sản phẩm nào để nhập'
            });
        }

        const invalidIdProducts = [];
        for (let i = 0; i < productsToImport.length; i++) {
            const product = productsToImport[i];

            if (!product.productId || !product.title) {
                return res.status(400).json({
                    success: false,
                    error: `Sản phẩm #${i + 1} thiếu ID hoặc tên sản phẩm`
                });
            }

            if (!isValidProductId(product.productId)) {
                invalidIdProducts.push({
                    index: i + 1,
                    productId: product.productId,
                    title: product.title
                });
            }

            if (!product.category)
                product.category = "Chưa phân loại";
            if (!product.images)
                product.images = [];
            if (!product.description)
                product.description = { details: "" };
            if (!product.description.details)
                product.description.details = "";
            if (!product.rating)
                product.rating = 0;

            if (!product.additionalInfo) {
                product.additionalInfo = {
                    quantity: 0,
                    price: 0,
                    brand: "Chưa cung cấp",
                    origin: "Chưa cung cấp"
                };
            } else {
                if (product.additionalInfo.quantity === undefined)
                    product.additionalInfo.quantity = 0;
                if (product.additionalInfo.price === undefined)
                    product.additionalInfo.price = 0;
                if (!product.additionalInfo.brand)
                    product.additionalInfo.brand = "Chưa cung cấp";
                if (!product.additionalInfo.origin)
                    product.additionalInfo.origin = "Chưa cung cấp";
            }

            product.rating = Number(product.rating);
            product.additionalInfo.price = Number(product.additionalInfo.price);
            product.additionalInfo.quantity = Number(product.additionalInfo.quantity);
        }

        if (invalidIdProducts.length > 0) {
            return res.status(400).json({
                success: false,
                error: `ID sản phẩm không hợp lệ. Sử dụng đúng định dạng: [FOOD/ACCE/TOYS/CARE/CLTH/CAGE] + 4 chữ số`
            });
        }

        const collection = getCollection();

        const productIds = productsToImport.map(p => p.productId);
        const existingProducts = await collection.find({ productId: { $in: productIds } }).toArray();

        if (existingProducts.length > 0) {
            const duplicateIds = existingProducts.map(p => p.productId);
            return res.status(400).json({
                success: false,
                error: `Trùng ID sản phẩm: ${duplicateIds.join(', ')}`
            });
        }

        const result = await collection.insertMany(productsToImport);

        console.log(`Đã nhập ${result.insertedCount} sản phẩm vào cơ sở dữ liệu từ JSON`);

        return res.status(200).json({
            success: true,
            importedCount: result.insertedCount,
            message: `Đã nhập thành công ${result.insertedCount} sản phẩm`
        });
    } catch (error) {
        console.error('Lỗi khi xử lý nhập JSON:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi xử lý dữ liệu. Vui lòng thử lại.'
        });
    }
});

// Update single product
app.put('/update/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const collection = getCollection();
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
        const collection = getCollection();

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
        const collection = getCollection();
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
        const collection = getCollection();
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

app.get('*', (req, res) => res.send('Hẹn bạn trong tương lai nhé!'));

app.listen(port, () => console.log(`Máy chủ đang chạy tại địa chỉ http://localhost:${port}`));