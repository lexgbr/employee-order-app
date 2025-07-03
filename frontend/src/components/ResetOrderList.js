import React, { useState } from 'react';
import axios from 'axios';
import suppliers from '../config/suppliers';
import { toast } from 'react-toastify';

const ResetOrderList = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const handleReset = async () => {
    if (!selectedSupplier) {
      toast.error('❌ Selectează un furnizor pentru resetare.');
      return;
    }

    const confirmed = window.confirm(
      `Esti sigur ca ai comandat tot ce ai nevoie pentru ${selectedSupplier}?\nDaca apesi Da, lista se va sterge si va fi arhivata.`
    );
    if (!confirmed) return;

    try {
      await axios.post(
        `http://localhost:5000/api/orders/reset/${encodeURIComponent(selectedSupplier)}`
      );
      toast.success(`✅ Lista pentru '${selectedSupplier}' a fost resetată și arhivată.`);
      setSelectedSupplier('');
    } catch (err) {
      console.error(err);
      toast.error('❌ A apărut o eroare la resetarea listei.');
    }
  };

  return (
    <div style={{ marginTop: 40, fontSize: '1.1rem' }}>
      <h3 style={{ fontSize: '1.4rem' }}>♻️ Resetare Listă Comenzi</h3>

      <label>
        Alege furnizorul:{' '}
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          style={{ padding: '8px', fontSize: '1rem', marginLeft: 8 }}
        >
          <option value="">-- Selectează furnizor --</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={handleReset}
        style={{
          marginLeft: 10,
          padding: '8px 16px',
          fontSize: '1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        🧹 Resetare Listă
      </button>
    </div>
  );
};

export default ResetOrderList;
