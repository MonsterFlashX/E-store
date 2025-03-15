const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json()); // Allows Backend to parse JSON

const ORDERS_FILE = "./orders.json";

// Load orders from JSON file
const loadOrders = () => {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const data = fs.readFileSync(ORDERS_FILE);
    return JSON.parse(data);
}

// Save orders to JSON file
const saveOrders = (orders) => {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

const PRODUCTS_FILE = "./products.json";
const loadProducts = () => {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    const data = fs.readFileSync(PRODUCTS_FILE);
    return JSON.parse(data);
}

const saveProducts = (products) => {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

app.get("/api/products", (req, res) => {
    const searchTerm = req.query.q;
    const products = loadProducts();
    res.json(products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())));
});

app.post("/api/products", (req, res) => {
    const { product } = req.body;

    if (!product || product == undefined) {
        return res.json(400).json({ error: "Product missing from request" });
    }

    try {
        const products = loadProducts();
        products.push(product);
        product.id = products.length + 1;
        saveProducts(products);

        res.json({ message: "Product added successfully", productId: product.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to process order" });
    }
});

// Get all orders
app.get("/api/orders", (req, res) => {
    const orders = loadOrders();
    res.json(orders);
});

// POST (Create a new order)
app.post("/api/orders/checkout", (req, res) => {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.json(400).json({ error: "Cart is empty" });
    }

    try {
        let total = 0;
        const products = loadProducts();
        cart.forEach(item => {
            let productExists = false;
            products.forEach(product => {
                if (product.id === item.productId) {
                    productExists = true;
                }
            });

            if (!productExists) {
                res.status(404).json({
                    message: `Product with id: ${item.productId} does not exist`,
                });
            }

            item = {
                ...item,
                id: Math.floor(Math.random() * 100),
            };


            products.forEach(product => {
                if (product.id === item.productId) {
                    if (product.stock === 0) {
                        res.status(404).json({
                            message: `Product ${product.name} (${product.id}) is out of stock`,
                        });
                    }
                    product.stock -= item.quantity;
                }
            });

            total += item.totalPrice;
        });

        const orders = loadOrders();
        const newOrder = {
            orderId: orders.length + 1,
            items: cart,
            total: total,
            createDateTime: new Date()
        };
        orders.push(newOrder);

        saveOrders(orders);
        saveProducts(products);
        res.json({ message: "Order placed successfully!", orderId: newOrder.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to process order" });
    }
});

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


