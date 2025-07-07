import React from 'react';
import {
  FaClipboardList,
  FaUsers,
  FaBoxes,
  FaTruck,
  FaChartBar,
  FaSignOutAlt
} from 'react-icons/fa';
import './DashboardLayout.css';

const DashboardLayout = ({ children, onLogout, activeTab, setActiveTab }) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
  <div className="dashboard-header-top">
    <button className="logout-button" onClick={onLogout}>
      <FaSignOutAlt /> Logout
    </button>

    <div className="logo-title">
      <h1 className="dashboard-title">TNG Order Manager</h1>
    </div>
  </div>

  <nav className="dashboard-nav">
    <span className={activeTab === 'supplier-orders' ? 'active' : ''} onClick={() => setActiveTab('supplier-orders')}>
      <FaClipboardList /> Comenzi Furnizori
    </span>
    <span className={activeTab === 'customer-orders' ? 'active' : ''} onClick={() => setActiveTab('customer-orders')}>
      <FaUsers /> Comenzi Clienți
    </span>
    <span className={activeTab === 'stock' ? 'active' : ''} onClick={() => setActiveTab('stock')}>
      <FaBoxes /> Stoc
    </span>
    <span className={activeTab === 'delivery' ? 'active' : ''} onClick={() => setActiveTab('delivery')}>
      <FaTruck /> Livrări
    </span>
    <span className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
      <FaChartBar /> Analytics
    </span>
  </nav>
</header>


      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default DashboardLayout;
