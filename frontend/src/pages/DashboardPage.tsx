import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import styles from './DashboardPage.module.css';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const cafeColors = ['#0F2A1D', '#375534', '#6B9071', '#AEC3B0', '#E3EED4'];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('day');
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.getSummary(),
      dashboardService.getTopItems(),
      dashboardService.getRevenue(range),
      dashboardService.getRecentTransactions(),
    ]).then(([summary, topItems, revenue, recentTx]) => {
      setSummary(summary);
      setTopItems(topItems);
      setRevenue(revenue);
      setRecentTransactions(recentTx);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setRevenueLoading(true);
    dashboardService.getRevenue(range).then(revenue => {
      setRevenue(revenue);
    }).finally(() => setRevenueLoading(false));
  }, [range]);

  if (loading) return <div className={styles.dashboardPage_root}>Loading dashboard...</div>;

  const hasRevenueData = Array.isArray(revenue) && revenue.length > 0;
  const hasTopItems = Array.isArray(topItems) && topItems.length > 0;

  return (
    <Layout orderCount={summary?.totalOrders || 0} user={{
      name: user?.username || '',
      role: user?.role || '',
      email: user?.email || undefined,
    }}>
      <div style={{ padding: '0 2.5rem', marginTop: '2.2rem' }}>
        <div className={styles.dashboardPage_cards}>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitle}>Total Revenue</div>
            <div className={styles.dashboardPage_cardValue}>₹{summary?.totalRevenue?.toLocaleString() || 0}</div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitle}>Total Orders</div>
            <div className={styles.dashboardPage_cardValue}>{summary?.totalOrders || 0}</div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitle}>Average Bill</div>
            <div className={styles.dashboardPage_cardValue}>₹{summary?.averageBill?.toLocaleString() || 0}</div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitle}>Total Discounts</div>
            <div className={styles.dashboardPage_cardValue}>₹{summary?.totalDiscounts?.toLocaleString() || 0}</div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitle}>Today's Revenue</div>
            <div className={styles.dashboardPage_cardValue}>₹{summary?.todaysRevenue?.toLocaleString() || 0}</div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitle}>Today's Orders</div>
            <div className={styles.dashboardPage_cardValue}>{summary?.todaysOrders || 0}</div>
          </div>
        </div>

        {/* Top row: Sales Statistic and Top Selling Items */}
        <div className={styles.dashboardPage_topRow}>
          <div className={styles.dashboardPage_section} style={{ flex: 2, marginRight: '2.2rem' }}>
            <div className={styles.dashboardPage_sectionTitleRow}>
              <div className={styles.dashboardPage_sectionTitle}>Sales Statistic</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div className={styles.dashboardPage_chartToggle}>
                  <button
                    type="button"
                    className={chartMetric === 'revenue' ? styles.dashboardPage_chartToggleActive : ''}
                    onClick={() => setChartMetric('revenue')}
                  >
                    Revenue
                  </button>
                  <button
                    type="button"
                    className={chartMetric === 'orders' ? styles.dashboardPage_chartToggleActive : ''}
                    onClick={() => setChartMetric('orders')}
                  >
                    Orders
                  </button>
                </div>
                <select
                  className={styles.dashboardPage_select}
                  value={range}
                  onChange={e => setRange(e.target.value)}
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>
            <div style={{ width: '100%', height: 260, background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '1.2rem 1.2rem 0.5rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {revenueLoading ? (
                <div style={{ color: '#375534', fontWeight: 500 }}>Loading sales data...</div>
              ) : hasRevenueData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenue}>
                    <XAxis dataKey="label" stroke="#375534" />
                    <YAxis stroke="#375534" />
                    <Tooltip />
                    {chartMetric === 'revenue' && (
                      <Line type="monotone" dataKey="revenue" stroke="#0F2A1D" name="Revenue" />
                    )}
                    {chartMetric === 'orders' && (
                      <Line type="monotone" dataKey="orders" stroke="#6B9071" name="Orders" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className={styles.dashboardPage_emptyState}>No sales data available.</div>
              )}
            </div>
          </div>
          <div className={styles.dashboardPage_section} style={{ flex: 1 }}>
            <div className={styles.dashboardPage_sectionTitle}>Top Selling Items</div>
            <div style={{ width: '100%', height: 260 }}>
              {hasTopItems ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topItems} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#0F2A1D" label />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className={styles.dashboardPage_emptyState}>No item sales data available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom row: Recent Transactions */}
        <div className={styles.dashboardPage_section} style={{ marginTop: '2.5rem' }}>
          <div className={styles.dashboardPage_sectionTitle}>Recent Transactions</div>
          <div style={{ width: '100%', height: 260, overflowY: 'auto' }}>
            {recentTransactions.length === 0 ? (
              <div className={styles.dashboardPage_emptyState}>No recent transactions available.</div>
            ) : (
              <table className={styles.dashboardPage_table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, idx) => (
                    <tr key={idx}>
                      <td>{tx.customer}</td>
                      <td>{Array.isArray(tx.items) ? tx.items.join(', ') : ''}</td>
                      <td>₹{tx.value}</td>
                      <td>{tx.date ? new Date(tx.date).toLocaleString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 