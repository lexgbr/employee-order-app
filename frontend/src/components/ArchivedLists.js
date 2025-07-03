import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const ArchivedLists = () => {
  const [archives, setArchives] = useState([]);
  const [selectedArchiveId, setSelectedArchiveId] = useState('');

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/archived');
        setArchives(res.data);
      } catch (error) {
        toast.error('❌ Arhivele nu au putut fi încărcate');
        console.error('Failed to fetch archives', error);
      }
    };
    fetchArchives();
  }, []);

  const selectedArchive = archives.find(a => a._id === selectedArchiveId);

  const downloadPDF = (archive) => {
    const doc = new jsPDF();
    doc.text(`Arhiva Comenzi: ${archive.supplier}`, 14, 15);
    doc.text(`Perioada: ${new Date(archive.startedAt).toLocaleString()} - ${new Date(archive.deletedAt).toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Employee', 'SKU', 'Qty', 'Supplier', 'Shop', 'Buy Order', 'Date']],
      body: archive.orders.map(o => [
        o.employee,
        o.sku,
        o.quantity,
        o.supplier,
        o.shop || '-',
        o.buyOrder || '-',
        new Date(o.timestamp).toLocaleString(),
      ]),
    });

    doc.save(`archive_${archive.supplier}.pdf`);
    toast.success('📄 PDF exportat cu succes');
  };

  const downloadExcel = (archive) => {
    const worksheet = XLSX.utils.json_to_sheet(archive.orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `archive_${archive.supplier}.xlsx`);
    toast.success('📊 Excel exportat cu succes');
  };

  return (
    <div style={{ marginTop: 40, padding: 20, fontSize: '1.1rem' }}>
      <h3 style={{ fontSize: '1.5rem' }}>📦 Arhive Comenzi</h3>

      {archives.length > 0 ? (
        <>
          <label>
            Selectează arhiva:{' '}
            <select
              value={selectedArchiveId}
              onChange={e => setSelectedArchiveId(e.target.value)}
              style={{ padding: '8px', fontSize: '1rem', marginLeft: 8 }}
            >
              <option value="">-- Alege arhiva --</option>
              {archives.map((a, i) => (
                <option key={a._id} value={a._id}>
                  {a.supplier} ({new Date(a.deletedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </label>

          {selectedArchive && (
            <div style={{ marginTop: 20, padding: 15, border: '1px solid #ccc', borderRadius: 8 }}>
              <p>
                <strong>Furnizor:</strong> {selectedArchive.supplier} <br />
                <strong>Start:</strong> {new Date(selectedArchive.startedAt).toLocaleString()} <br />
                <strong>Șters:</strong> {new Date(selectedArchive.deletedAt).toLocaleString()}
              </p>
              <button
                onClick={() => downloadPDF(selectedArchive)}
                style={{ padding: '8px 16px', fontSize: '1rem' }}
              >
                📄 Export PDF
              </button>
              <button
                onClick={() => downloadExcel(selectedArchive)}
                style={{ padding: '8px 16px', fontSize: '1rem', marginLeft: 10 }}
              >
                📊 Export Excel
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ marginTop: 20 }}>Nu există arhive salvate.</p>
      )}
    </div>
  );
};

export default ArchivedLists;
