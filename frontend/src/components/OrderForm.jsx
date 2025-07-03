import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import suppliers from '../config/suppliers';
import shops from '../config/shops';
import { toast } from 'react-toastify';

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
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <h2 style={{ fontSize: '1.5rem' }}>📦 Trimite Comandă</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Angajat</label>
        <input
          type="text"
          value={numeAngajat || ''}
          readOnly
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>SKU</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Cantitate</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Furnizor</label>
        <select
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10 }}
        >
          <option value="">-- Selectează furnizor --</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Magazin</label>
        <select
          name="shop"
          value={formData.shop}
          onChange={handleChange}
          style={{ width: '100%', padding: 10 }}
        >
          <option value="">-- Selectează magazin --</option>
          {shops.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Buy Order</label>
        <input
          type="text"
          name="buyOrder"
          value={formData.buyOrder}
          onChange={handleChange}
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '1rem',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        Trimite Comanda
      </button>
    </form>
  );
};

export default OrderForm;
