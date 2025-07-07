import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import Panel from '../components/Panel';
import OrderForm from '../components/OrderForm';
import ExportButtons from '../components/ExportButtons';
import ResetOrderList from '../components/ResetOrderList';
import ArchivedLists from '../components/ArchivedLists';

// Mock placeholders for sections in development
const CustomerOrderForm = () => (
  <form>
    <input placeholder="Nume client" />
    <input placeholder="Shop" />
    <input placeholder="Order ID" />
    <input placeholder="SKU" />
    <input placeholder="Cantitate" />
    <button>Adaugă comandă client</button>
  </form>
);

const StockUploadPanel = () => (
  <div>
    <p>Încarcă fișierul exportat din aplicația de logistică:</p>
    <input type="file" />
    <button>Încarcă stoc</button>
  </div>
);

const DeliveryPanel = () => (
  <div>
    <p>Vor apărea aici comenzile ce pot fi pregătite pentru livrare.</p>
  </div>
);

const AnalyticsPanel = () => (
  <div>
    <p>Estimări lunare pentru stoc + produse care se vând des.</p>
  </div>
);

const DashboardPage = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('supplier-orders');

  return (
    <DashboardLayout onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'supplier-orders' && (
        <>
          <Panel title="📥 Comenzi către Furnizori">
            <OrderForm />
          </Panel>
          <Panel title="📤 Exportă / Resetare">
            <ExportButtons />
            <ResetOrderList />
          </Panel>
          <Panel title="📁 Arhivă Comenzi">
            <ArchivedLists />
          </Panel>
        </>
      )}

      {activeTab === 'customer-orders' && (
        <Panel title="🛒 Comenzi Clienți">
          <CustomerOrderForm />
        </Panel>
      )}

      {activeTab === 'stock' && (
        <Panel title="📦 Stoc">
          <StockUploadPanel />
        </Panel>
      )}

      {activeTab === 'delivery' && (
        <Panel title="🚚 Livrări">
          <DeliveryPanel />
        </Panel>
      )}

      {activeTab === 'analytics' && (
        <Panel title="📊 Analytics">
          <AnalyticsPanel />
        </Panel>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
