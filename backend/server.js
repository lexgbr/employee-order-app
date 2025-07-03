const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ MongoDB connected'));

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Order schema
const orderSchema = new mongoose.Schema({
  employee: String,
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  supplier: { type: String, required: true },
  shop: String,
  buyOrder: String,
  timestamp: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Archived orders schema
const archivedOrderSchema = new mongoose.Schema({
  orders: [orderSchema],
  supplier: String,
  startedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: Date.now }
});

const ArchivedOrder = mongoose.model('ArchivedOrder', archivedOrderSchema);

// Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// ✅ Reset orders by supplier and archive them
app.post('/api/orders/reset/:supplier', async (req, res) => {
  const supplier = req.params.supplier;

  try {
    const ordersToArchive = await Order.find({ supplier });

    if (ordersToArchive.length === 0) {
      return res.status(404).json({ error: `No orders found for supplier '${supplier}'` });
    }

    const archive = new ArchivedOrder({
      orders: ordersToArchive,
      supplier,
      startedAt: ordersToArchive[0].timestamp,
      deletedAt: new Date()
    });

    await archive.save();
    await Order.deleteMany({ supplier });

    res.status(200).json({ message: `Orders for '${supplier}' archived and reset.` });
  } catch (err) {
    console.error('❌ Reset error:', err);
    res.status(500).json({ error: 'Reset failed' });
  }
});

// ✅ Get archived orders
app.get('/api/archived', async (req, res) => {
  try {
    const archives = await ArchivedOrder.find().sort({ deletedAt: -1 });
    res.json(archives);
  } catch (err) {
    console.error('❌ Failed to fetch archived orders:', err);
    res.status(500).json({ error: 'Failed to fetch archived orders' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
