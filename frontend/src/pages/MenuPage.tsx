import React, { useEffect, useState } from 'react';
import type { MenuItem, OrderItem, Order } from '../types';
import itemService from '../services/itemService';
import orderService from '../services/orderService';
import dashboardService from '../services/dashboardService';
import OrderSummaryPanel from '../components/OrderSummaryPanel';
import ItemCard from '../components/ItemCard';
import BillPreviewModal from '../components/BillPreviewModal';
import TopBar from '../components/TopBar';
import MenuCategoryTabs from '../components/MenuCategoryTabs';
import { useAuth } from '../context/AuthContext';
import styles from './MenuPage.module.css';
import BillResultModal from '../components/BillResultModal';
import Layout from '../components/Layout';

const categories = [
  { key: 'All', label: 'All' },
  { key: 'Coffee', label: 'Coffee' },
  { key: 'Tea', label: 'Tea' },
  { key: 'Snack', label: 'Snack' },
];

const MenuPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customerName, setCustomerName] = useState('');
  const [table, setTable] = useState('');
  const [orderCount, setOrderCount] = useState<number>(0);
  const [billResult, setBillResult] = useState<any>(null);

  useEffect(() => {
    itemService.getItems().then(setItems).finally(() => setLoading(false));
    if (user?.role === 'OWNER') {
      dashboardService.getSummary().then(summary => {
        setOrderCount(summary?.orders || 0);
      });
    }
  }, [user]);

  const handleAddItem = (item: MenuItem) => {
    setSelectedItems(prev => {
      const found = prev.find(oi => oi.item.id === item.id);
      if (found) {
        return prev.map(oi => oi.item.id === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(oi => oi.item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setSelectedItems(prev => prev.map(oi => oi.item.id === itemId ? { ...oi, quantity } : oi));
  };

  const handleGenerateBill = () => {
    setShowPreview(true);
  };

  const handleConfirmBill = async () => {
    setGenerating(true);
    setError('');
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      const payload = {
        userId: parseInt(user.id),
        items: selectedItems.map(oi => ({ itemId: oi.item.id, quantity: oi.quantity })),
        customerName,
        table,
      };
      const order = await orderService.createOrder(payload);
      const bill = await orderService.generateBill(order.id);
      setBillResult(bill);
      setOrderSuccess(null);
      setSelectedItems([]);
      setShowPreview(false);
      setCustomerName('');
      setTable('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate bill');
    } finally {
      setGenerating(false);
    }
  };

  const filteredItems = items.filter(item =>
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout orderCount={orderCount} user={{
      name: user?.username || '',
      role: user?.role || '',
      email: user?.email || undefined,
    }}>
      {billResult ? (
        <BillResultModal
          open={!!billResult}
          bill={billResult}
          user={user || { username: '' }}
          onPrint={() => {}}
          onClose={() => setBillResult(null)}
        />
      ) : (
        <div className={styles.menuPage_main}>
          <div className={styles.menuPage_leftPanel}>
            <div className={styles.menuPage_searchContainer}>
              <div className={styles.menuPage_searchBar}>
                <span className={styles.menuPage_searchIcon}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="7" stroke="#375534" strokeWidth="2" />
                    <path d="M15 15L18 18" stroke="#375534" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className={styles.menuPage_searchInput}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span className={styles.menuPage_searchShortcut}>
                  &#8984;
                </span>
              </div>
            </div>
            <MenuCategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              items={items}
            />
            {loading ? (
              <div style={{ color: '#375534' }}>Loading menu...</div>
            ) : (
              <div className={styles.menuPage_grid}>
                {filteredItems.map(item => (
                  <ItemCard key={item.id} item={item} onAdd={() => handleAddItem(item)} />
                ))}
              </div>
            )}
          </div>
          <div className={styles.menuPage_rightPanel}>
            <OrderSummaryPanel
              orderItems={selectedItems}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onGenerateBill={handleGenerateBill}
              generating={generating}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
            />
            {error && <div style={{ color: '#e53935', marginTop: 8 }}>{error}</div>}
            {orderSuccess && (
              <div className={styles.menuPage_success}>
                <div className={styles.menuPage_successTitle}>Bill Generated!</div>
                <div>Receipt ID: <span className={styles.menuPage_successReceipt}>{orderSuccess.id}</span></div>
                <div>Total: <span className={styles.menuPage_successTotal}>${orderSuccess.total.toFixed(2)}</span></div>
                <button className={styles.menuPage_successBtn} onClick={() => setOrderSuccess(null)}>New Order</button>
              </div>
            )}
          </div>
        </div>
      )}
      <BillPreviewModal
        open={showPreview}
        orderItems={selectedItems}
        subtotal={selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0)}
        tax={selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0) * 0.1}
        total={selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0) * 1.1}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmBill}
      />
    </Layout>
  );
};

export default MenuPage; 