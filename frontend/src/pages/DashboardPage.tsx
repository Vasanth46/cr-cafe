import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { FileClockIcon ,Wallet ,ShoppingBag ,ClipboardList,TrendingUp,ReceiptText,Percent,PieChart as PieChartIcon,LineChart as LineChartIcon} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import styles from './DashboardPage.module.css';
import logo from '../assets/logo.jpg';
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
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders' | 'users'>('revenue');
  const [usersPerformance, setUsersPerformance] = useState<any>(null);
  const [usersRange, setUsersRange] = useState('day');
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    setUsersLoading(true);
    dashboardService.getUsersPerformance(usersRange)
        .then(data => {
          setUsersPerformance(data);
        })
        .catch(err => console.error("Failed to fetch worker performance", err))
        .finally(() => setUsersLoading(false));
  }, [usersRange]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.getSummary(),
      dashboardService.getTopItems(),
      dashboardService.getRevenue(range),
      dashboardService.getRecentTransactions()
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
  const formattedUserData = usersPerformance && usersPerformance.length > 0
      ? [{
        name: 'Orders',
        ...usersPerformance.reduce((acc, user) => {
          acc[user.username] = user.orders;
          return acc;
        }, {})
      }]
      : [];

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
            <div className={styles.dashboardPage_cardTitleRow}>
              <Wallet className={styles.dashboardPage_cardIconInline} />
              <span>Total Revenue</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>₹{summary?.totalRevenue?.toLocaleString() || 0}</div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitleRow}>
              <ClipboardList className={styles.dashboardPage_cardIconInline} />
              <span>Total Orders</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              {summary?.totalOrders?.toLocaleString() || 0}
            </div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitleRow}>
              <ReceiptText className={styles.dashboardPage_cardIconInline} />
              <span>Average Bill</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              ₹{summary?.averageBill?.toLocaleString() || 0}
            </div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitleRow}>
              <Percent className={styles.dashboardPage_cardIconInline} />
              <span>Discounts</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              ₹{summary?.totalDiscounts?.toLocaleString() || 0}
            </div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitleRow}>
              <TrendingUp className={styles.dashboardPage_cardIconInline} />
              <span>Today's Revenue</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              ₹{summary?.todaysRevenue?.toLocaleString() || 0}
            </div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardHeader}>
              <ShoppingBag className={styles.dashboardPage_cardIconInline} />
              <span className={styles.dashboardPage_cardTitle}>Today's Orders</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              {summary?.todaysOrders?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        {/* Top row: Sales Statistic and Top Selling Items */}
        <div className={styles.dashboardPage_topRow}>
          <div className={styles.dashboardPage_section} style={{ flex: 2, marginRight: '2.2rem' }}>
            <div className={styles.dashboardPage_sectionTitleRow}>
              <div className={styles.dashboardPage_sectionTitle}>
                <LineChartIcon className={styles.dashboardPage_cardIconInline} style={{ marginRight: '0.6rem' }} />
                Sales Statistic
              </div>
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
                  <button
                      type="button"
                      className={chartMetric === 'users' ? styles.dashboardPage_chartToggleActive : ''}
                      onClick={() => setChartMetric('users')}
                  >
                    Users
                  </button>
                </div>
                <div className={styles.dashboardPage_rangeToggle}>
                {['day', 'week', 'month'].map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setRange(option);
                          if (chartMetric === 'users') setUsersRange(option);
                        }}
                        className={`${styles.dashboardPage_rangeButton} ${range === option ? styles.dashboardPage_rangeButtonActive : ''}`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
              </div>
              </div>
            </div>
            <div style={{ width: '100%', height: 260, background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '1.2rem 1.2rem 0.5rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {revenueLoading ? (
                <div style={{ color: '#375534', fontWeight: 500 }}>Loading sales data...</div>
              ) : hasRevenueData ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartMetric === 'users' ? (
                      usersLoading ? (
                          <div style={{ color: '#375534', fontWeight: 500 }}>Loading user data...</div>
                      ) : usersPerformance && usersPerformance.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedUserData}>
                              <text
                                  x="50%"
                                  y="50%"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  opacity={0.08}
                                  fontSize={48}
                                  fill="#375534"
                                  fontWeight="bold"
                                  pointerEvents="none"
                              >
                                CR's Cafe
                              </text>
                              <YAxis stroke="#6B9071" tick={{ fill: '#375534' }} allowDecimals={false} />
                              <Tooltip
                                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #d8e3d2' }}
                                  labelStyle={{ color: '#0F2A1D' }}
                                  cursor={{ stroke: '#AEC3B0', strokeWidth: 1 }}
                              />

                              {usersPerformance.map((user, index) => (
                                  <Line
                                      key={user.username}
                                      type="monotone"
                                      dataKey={user.username}
                                      stroke={cafeColors[index % cafeColors.length]}
                                      strokeWidth={3}
                                      dot={{ r: 5 }}
                                      activeDot={{ r: 6 }}
                                      name={user.username}
                                  />
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                      ) :  (
                          <div className={styles.dashboardPage_emptyState}>No user performance data available.</div>
                      )
                  ) : hasRevenueData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenue}>
                          <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              opacity={0.08}
                              fontSize={48}
                              fill="#375534"
                              fontWeight="bold"
                              pointerEvents="none"
                          >
                            CR's Cafe
                          </text>

                          <XAxis dataKey="label" stroke="#6B9071" tick={{ fill: '#375534' }} axisLine={true} tickLine={true} />
                          <YAxis stroke="#6B9071" tick={{ fill: '#375534' }} axisLine={true} tickLine={true} />
                          <Tooltip
                              contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #d8e3d2' }}
                              labelStyle={{ color: '#0F2A1D' }}
                              cursor={{ stroke: '#AEC3B0', strokeWidth: 1 }}
                          />
                          {chartMetric === 'revenue' && (
                              <Line
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke="#0F2A1D"
                                  strokeWidth={3}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 6, fill: '#375534' }}
                                  name="Revenue"
                              />
                          )}
                          {chartMetric === 'orders' && (
                              <Line
                                  type="monotone"
                                  dataKey="orders"
                                  stroke="#6B9071"
                                  strokeWidth={3}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 6, fill: '#AEC3B0' }}
                                  name="Orders"
                              />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className={styles.dashboardPage_emptyState}>No sales data available.</div>
                  )}

                </ResponsiveContainer>
              ) : (
                <div className={styles.dashboardPage_emptyState}>No sales data available.</div>
              )}
            </div>
          </div>
          <div className={styles.dashboardPage_section} style={{ flex: 1 }}>
            <div className={styles.dashboardPage_sectionTitle}>
              <PieChartIcon className={styles.dashboardPage_cardIconInline} style={{ marginRight: '0.6rem' }} />
              Items Performance
            </div>
            <div style={{ width: '100%', height: 260 }}>
              {hasTopItems ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                        data={topItems}
                        dataKey="sales"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={false}
                    >
                      {topItems.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={cafeColors[index % cafeColors.length]} />
                      ))}
                    </Pie>
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
          <div className={styles.dashboardPage_sectionTitle}>
            <FileClockIcon className={styles.dashboardPage_cardIconInline} />
            Recent Transactions
          </div>
          <div style={{ width: '100%', height: 260, overflowY: 'auto' }}>
            {recentTransactions.length === 0 ? (
              <div className={styles.dashboardPage_emptyState}>No recent transactions available.</div>
            ) : (
              <table className={styles.dashboardPage_table}>
                <thead style={{ backgroundColor: '#375534', color: 'white' }}>
                  <tr>
                    <th>Handled By</th>
                    <th>Order Id</th>
                    <th>Receipt Id</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, idx) => (
                      <tr
                          key={idx}
                          className={`${idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd} ${styles.tableRowHover}`}
                      >

                    <td>{tx.handled_by}</td>
                      <td>{tx.order_id}</td>
                      <td>{tx.receipt_id}</td>
                      <td>₹{tx.final_amount}</td>
                      <td>{tx.date ? new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : ''}</td>
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