import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import suppliers from '../config/suppliers';
import { toast } from 'react-toastify';

const ExportButtons = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const fetchOrders = async (supplier) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders?supplier=${encodeURIComponent(supplier)}`);
      return res.data;
    } catch (err) {
      toast.error('❌ Nu s-au putut prelua comenzile pentru export.');
      return [];
    }
  };

  const exportToExcel = async () => {
    if (!selectedSupplier) return toast.error('❌ Selectează un furnizor.');
    const orders = await fetchOrders(selectedSupplier);
    if (orders.length === 0) return toast.warn('⚠️ Nu există comenzi.');

    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `orders_${selectedSupplier}.xlsx`);
    toast.success('📊 Export Excel complet realizat.');
  };

  const exportToPDF = async () => {
    if (!selectedSupplier) return toast.error('❌ Selectează un furnizor.');
    const orders = await fetchOrders(selectedSupplier);
    if (orders.length === 0) return toast.warn('⚠️ Nu există comenzi.');

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
    toast.success('📄 Export PDF complet realizat.');
  };

  const exportQuickExcel = async () => {
    if (!selectedSupplier) return toast.error('❌ Selectează un furnizor.');
    const orders = await fetchOrders(selectedSupplier);
    if (orders.length === 0) return toast.warn('⚠️ Nu există comenzi.');

    const simplified = orders.map(o => ({
      SKU: o.sku,
      Cantitate: o.quantity
    }));

    const worksheet = XLSX.utils.json_to_sheet(simplified);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comanda');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `comanda_${selectedSupplier}.xlsx`);
    toast.success('📦 Excel simplificat pentru comandă generat.');
  };

  return (
    <div style={{ marginTop: 30, fontSize: '1.1rem' }}>
      <label>
        Selectează furnizor pentru export:{' '}
        <select
          value={selectedSupplier}
          onChange={e => setSelectedSupplier(e.target.value)}
          style={{ padding: '6px', fontSize: '1rem', marginLeft: 8 }}
        >
          <option value="">-- Alege furnizor --</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 10 }}>
        <button onClick={exportToPDF} style={{ marginRight: 10 }}>
          📄 Export PDF pentru a vedea lista curenta
        </button>
        <button onClick={exportToExcel} style={{ marginRight: 10 }}>
          📊 Export Excel pentru a vedea lista curenta
        </button>
        <button onClick={exportQuickExcel}>
          ⚡ Exportă în Excel pentru a comanda
        </button>
      </div>
    </div>
  );
};

export default ExportButtons;
