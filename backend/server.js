const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ MongoDB connected'));

const orderSchema = new mongoose.Schema({
  employee: { type: String, trim: true, default: '' },
  sku: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  supplier: { type: String, required: true, trim: true },
  shop: { type: String, trim: true, default: null },
  buyOrder: { type: String, trim: true, default: null },
  timestamp: { type: Date, default: Date.now }  // you can keep this or remove since createdAt exists
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

orderSchema.index({ sku: 1 });
orderSchema.index({ supplier: 1 });

const Order = mongoose.model('Order', orderSchema);

// Check for duplicate SKU
app.get('/api/orders/check/:sku', async (req, res) => {
  try {
    const order = await Order.findOne({ sku: { $regex: `^${req.params.sku}$`, $options: 'i' } });
    if (order) {
      res.json({ exists: true, data: { supplier: order.supplier, quantity: order.quantity } });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error during SKU check' });
  }
});

// Get orders, optionally filtered by supplier
app.get('/api/orders', async (req, res) => {
  try {
    const filter = {};
    if (req.query.supplier) {
      filter.supplier = req.query.supplier;
    }
    const orders = await Order.find(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order saved' });
  } catch (err) {
    // Detect validation errors and send meaningful message
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
