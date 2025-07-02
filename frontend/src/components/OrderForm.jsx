import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ExportButtons from './ExportButtons';
import suppliers from '../config/suppliers';

const OrderForm = () => {
  const [form, setForm] = useState({
    employee: '',
    sku: '',
    quantity: 1,
    supplier: '',
    shop: '',
    buyOrder: ''
  });

  const [shops] = useState([
    'TNG-Outdoor',
    'Piese-barca',
    'Accesorii-barca',
    'EMAG.ro',
    'EMAG.bg',
    'EMAG.hu',
    'Comanda telefonica/email'
  ]);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const debounceTimeout = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'sku') {
      setConfirmed(false);
    }
  };

  const handleCheckDuplicate = async () => {
    if (!form.sku) {
      setDuplicateInfo(null);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/check/${form.sku}`);
      if (res.data.exists) {
        setDuplicateInfo(res.data.data);
      } else {
        setDuplicateInfo(null);
      }
    } catch (error) {
      console.error('Duplicate check failed:', error);
      setDuplicateInfo(null);
    }
  };

  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleCheckDuplicate();
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [form.sku]);

  const validateForm = () => {
    if (!form.sku.trim()) {
      alert('SKU is required.');
      return false;
    }
    if (!form.supplier.trim()) {
      alert('Supplier is required.');
      return false;
    }
    if (!form.quantity || form.quantity < 1) {
      alert('Quantity must be 1 or greater.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (duplicateInfo && !confirmed) {
      alert(
        `SKU already exists.\nSupplier: ${duplicateInfo.supplier}\nQuantity: ${duplicateInfo.quantity}\n\nClick Submit again to confirm.`
      );
      setConfirmed(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders', form);
      alert('✅ Order added successfully!');
      setForm({
        employee: '',
        sku: '',
        quantity: 1,
        supplier: '',
        shop: '',
        buyOrder: ''
      });
      setDuplicateInfo(null);
      setConfirmed(false);
    } catch (error) {
      alert('Failed to add order.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <ExportButtons />
      <h2>Add Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Employee Name"
          name="employee"
          value={form.employee}
          onChange={handleChange}
        />
        <input
          required
          placeholder="SKU"
          name="sku"
          value={form.sku}
          onChange={handleChange}
        />
        <input
          type="number"
          min="1"
          required
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <select
          required
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select name="shop" value={form.shop} onChange={handleChange}>
          <option value="">Select Shop (optional)</option>
          {shops.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          placeholder="Buy Order Code"
          name="buyOrder"
          value={form.buyOrder}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {duplicateInfo && !confirmed && (
        <div style={{ color: 'red', marginTop: 10 }}>
          SKU already exists — Supplier: {duplicateInfo.supplier}, Qty: {duplicateInfo.quantity}
          <br />
          Click submit again to confirm.
        </div>
      )}
    </div>
  );
};

export default OrderForm;
