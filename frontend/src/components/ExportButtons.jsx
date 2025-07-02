import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import suppliers from '../config/suppliers'; // import your supplier list

const ExportButtons = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const fetchOrders = async (supplier) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders?supplier=${encodeURIComponent(supplier)}`);
      return res.data;
    } catch {
      alert('Failed to fetch orders');
      return [];
    }
  };

  const exportToExcel = async () => {
    if (!selectedSupplier) {
      alert('Please select a supplier before exporting.');
      return;
    }
    const orders = await fetchOrders(selectedSupplier);
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `orders_${selectedSupplier}.xlsx`);
  };

  const exportToPDF = async () => {
    if (!selectedSupplier) {
      alert('Please select a supplier before exporting.');
      return;
    }
    const orders = await fetchOrders(selectedSupplier);
    const doc = new jsPDF();

    doc.text(`Order List for ${selectedSupplier}`, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['Employee', 'SKU', 'Qty', 'Supplier', 'Shop', 'Buy Order', 'Date']],
      body: orders.map(order => [
        order.employee,
        order.sku,
        order.quantity,
        order.supplier,
        order.shop || '-',
        order.buyOrder || '-',
        new Date(order.timestamp || order.createdAt).toLocaleString(),
      ]),
    });

    doc.save(`orders_${selectedSupplier}.pdf`);
  };

  return (
    <div style={{ marginTop: 30 }}>
      <label>
        Select Supplier for Export:{' '}
        <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
          <option value="">-- Select Supplier --</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <button 
        onClick={exportToPDF} 
        style={{ marginLeft: 10 }} 
        disabled={!selectedSupplier}
      >
        Export PDF
      </button>
      <button 
        onClick={exportToExcel} 
        style={{ marginLeft: 10 }} 
        disabled={!selectedSupplier}
      >
        Export Excel
      </button>
    </div>
  );
};

export default ExportButtons;
