import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToaster } from '../components/Toaster';
import itemService from '../services/itemService';
import orderService from '../services/orderService';
import dashboardService from '../services/dashboardService';
import Layout from '../components/Layout';
import ItemCard from '../components/ItemCard';
import MenuCategoryTabs from '../components/MenuCategoryTabs';
import OrderSummaryPanel from '../components/OrderSummaryPanel';
import BillPreviewModal from '../components/BillPreviewModal';
import BillResultModal from '../components/BillResultModal';
import { PaymentMode } from '../types';
import type { MenuItem, OrderItem } from '../types';
import styles from './MenuPage.module.css';

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
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customerName, setCustomerName] = useState('');
  const [table, setTable] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.CASH);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [billResult, setBillResult] = useState<any>(null);
  const [showBillResult, setShowBillResult] = useState(false);
  const { showToast } = useToaster();

  const resetOrderState = () => {
    setSelectedItems([]);
    setCustomerName('');
    setTable('');
    setPaymentMode(PaymentMode.CASH);
    setError('');
  };

  const fetchOrderCount = useCallback(() => {
    if (user) {
      if (user.role === 'OWNER' || user.role === 'MANAGER') {
        dashboardService.getSummary().then(summary => {
          setOrderCount(summary?.todaysOrders || 0);
        });
      } else { // For WORKER role
        orderService.getMyTodaysOrderCount().then(count => {
          setOrderCount(count || 0);
        });
      }
    }
  }, [user]); // Dependency on user

  useEffect(() => {
    itemService.getItems().then(setItems).finally(() => setLoading(false));
    fetchOrderCount(); // Fetch on initial load
  }, [fetchOrderCount]);

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
    console.log("Clicked Generate Bill", selectedItems);
    if (selectedItems.length > 0) {
      setShowPreview(true);
    } else {
      setError('Please add items to the order first.');
    }
  };

  const handleConfirmBill = async () => {
    if (!user) {
      setError('You must be logged in to perform this action.');
      showToast('You must be logged in to perform this action.', 'error');
      return;
    }
    setGenerating(true);
    setError('');
    try {
      const payload = {
        userId: parseInt(user.id),
        items: selectedItems.map(oi => ({ itemId: oi.item.id, quantity: oi.quantity })),
        customerName,
        table,
      };
      const order = await orderService.createOrder(payload);
      const bill = await orderService.generateBill(order.id, undefined, paymentMode);
      
      setShowPreview(false);
      setBillResult(bill);
      setShowBillResult(true);

      resetOrderState();
      fetchOrderCount(); // Re-fetch the count after a successful order
      showToast('Order created successfully!', 'success');

    } catch (err: any) {
      setError(err.message || 'Failed to generate bill');
      showToast(err.message || 'Failed to generate bill', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const filteredItems = items.filter(item =>
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className={styles.menuPage_root}>
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
        </div>
        <div className={styles.menuPage_orderSummaryFixed}>
          <OrderSummaryPanel
            orderItems={selectedItems}
            onRemove={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onGenerateBill={handleGenerateBill}
            generating={generating}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
          />
        </div>
      </div>

      {user && (
        <>
          <BillPreviewModal
            open={showPreview}
            orderItems={selectedItems}
            subtotal={selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0)}
            tax={selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0) * 0.0}
            total={selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0)}
            onClose={() => {
              setShowPreview(false);
              resetOrderState();
            }}
            onConfirm={handleConfirmBill}
            user={user}
          />
          <BillResultModal
            open={showBillResult}
            bill={billResult}
            user={user}
            onPrint={() => {}}
            onClose={() => {
              setShowBillResult(false);
              setBillResult(null);
            }}
          />
        </>
      )}
    </Layout>
  );
};

export default MenuPage; 