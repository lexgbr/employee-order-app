import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import suppliers from '../config/suppliers';
import shops from '../config/shops';
import { toast } from 'react-toastify';
import '../components/Form.css';

const OrderForm = () => {
  const { token, numeAngajat } = useAuth();

  const [formData, setFormData] = useState({
    sku: '',
    quantity: '',
    supplier: '',
    shop: '',
    buyOrder: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const order = {
      ...formData,
      employee: numeAngajat
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(`❌ Comanda eșuată: ${err.error}`);
        return;
      }

      toast.success('✅ Comanda a fost trimisă cu succes');
      setFormData({
        sku: '',
        quantity: '',
        supplier: '',
        shop: '',
        buyOrder: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('❌ Eroare la trimiterea comenzii');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">📦 Trimite Comandă</h2>

      <div className="form-group">
        <label>Angajat</label>
        <input type="text" value={numeAngajat || ''} readOnly className="input-full" />
      </div>

      <div className="form-group">
        <label>SKU</label>
        <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="input-full" />
      </div>

      <div className="form-group">
        <label>Cantitate</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="input-full" />
      </div>

      <div className="form-group">
        <label>Furnizor</label>
        <select name="supplier" value={formData.supplier} onChange={handleChange} required className="input-full">
          <option value="">-- Selectează furnizor --</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Magazin</label>
        <select name="shop" value={formData.shop} onChange={handleChange} className="input-full">
          <option value="">-- Selectează magazin --</option>
          {shops.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Buy Order</label>
        <input type="text" name="buyOrder" value={formData.buyOrder} onChange={handleChange} className="input-full" />
      </div>

      <button type="submit" className="button-primary">Trimite Comanda</button>
    </form>
  );
};

export default OrderForm;
