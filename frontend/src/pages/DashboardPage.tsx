import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { FileClockIcon ,Wallet ,ShoppingBag ,ClipboardList,TrendingUp,ReceiptText,Percent,PieChart as PieChartIcon,LineChart as LineChartIcon} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import styles from './DashboardPage.module.css';
import logo from '../assets/logo.jpg';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getTodaysRevenueByPaymentMode } from '../services/dashboardService';
import { getRecentTransactionsPaginated } from '../services/dashboardService';
import { getRecentTransactionsWithFilters, getAllCashiers } from '../services/dashboardService';
import { Filter } from 'lucide-react';

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
  const [revenueByPaymentMode, setRevenueByPaymentMode] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cashiers, setCashiers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    cashier: '',
    minValue: '',
    maxValue: '',
    startDate: '',
    endDate: '',
    paymentMode: ''
  });
  const [appliedFilters, setAppliedFilters] = useState<{[key: string]: string}>({});
  const [filtersLoading, setFiltersLoading] = useState(false);

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
      getTodaysRevenueByPaymentMode()
    ]).then(([summary, topItems, revenue, revenueByPaymentMode]) => {
      setSummary(summary);
      setTopItems(topItems);
      setRevenue(revenue);
      setRevenueByPaymentMode(revenueByPaymentMode || {});
    }).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    setTransactionsLoading(true);
    if (Object.keys(appliedFilters).length === 0) {
      getRecentTransactionsPaginated(currentPage, 10)
        .then((data) => {
          setRecentTransactions(data.transactions || []);
          setTotalPages(data.totalPages || 1);
          setTotalTransactions(data.totalCount || 0);
        })
        .catch(err => console.error("Failed to fetch recent transactions", err))
        .finally(() => setTransactionsLoading(false));
    } else {
      getRecentTransactionsWithFilters(currentPage, 10, appliedFilters)
        .then((data) => {
          setRecentTransactions(data.transactions || []);
          setTotalPages(data.totalPages || 1);
          setTotalTransactions(data.totalCount || 0);
        })
        .catch(err => console.error("Failed to fetch filtered transactions", err))
        .finally(() => setTransactionsLoading(false));
    }
  }, [currentPage, appliedFilters]);

  useEffect(() => {
    getAllCashiers()
      .then(data => setCashiers(data))
      .catch(err => console.error("Failed to fetch cashiers", err));
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
        ...usersPerformance.reduce((acc: { [key: string]: number }, user: { username: string, orders: number }) => {
          acc[user.username] = user.orders;
          return acc;
        }, {})
      }]
      : [];

  if (loading) return <div className={styles.dashboardPage_root}>Loading dashboard...</div>;

  const hasRevenueData = Array.isArray(revenue) && revenue.length > 0;
  const hasTopItems = Array.isArray(topItems) && topItems.length > 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newAppliedFilters: {[key: string]: string} = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        newAppliedFilters[key] = value;
      }
    });
    setAppliedFilters(newAppliedFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const clearFilters = () => {
    setFilters({
      cashier: '',
      minValue: '',
      maxValue: '',
      startDate: '',
      endDate: '',
      paymentMode: ''
    });
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const removeFilter = (key: string) => {
    const newAppliedFilters = { ...appliedFilters };
    delete newAppliedFilters[key];
    setAppliedFilters(newAppliedFilters);
    setFilters(prev => ({ ...prev, [key]: '' }));
    setCurrentPage(1);
  };

  const getFilterDisplayName = (key: string, value: string) => {
    switch (key) {
      case 'cashier': return `Cashier: ${value}`;
      case 'minValue': return `Min Value: ₹${value}`;
      case 'maxValue': return `Max Value: ₹${value}`;
      case 'startDate': return `From: ${new Date(value).toLocaleDateString()}`;
      case 'endDate': return `To: ${new Date(value).toLocaleDateString()}`;
      case 'paymentMode': return `Payment: ${value}`;
      default: return `${key}: ${value}`;
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return (
      <div className={styles.paginationContainer}>
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        
        <div className={styles.pageNumbers}>
          {pages.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div style={{ padding: '0 2.5rem', marginTop: '2.2rem', marginBottom: '2rem' }}>
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
            <div className={styles.dashboardPage_cardTitleRow}>
              <TrendingUp className={styles.dashboardPage_cardIconInline} />
              <span>Today's Revenue (Cash)</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              ₹{revenueByPaymentMode?.CASH?.toLocaleString() || 0}
            </div>
          </div>
          <div className={styles.dashboardPage_card}>
            <div className={styles.dashboardPage_cardTitleRow}>
              <TrendingUp className={styles.dashboardPage_cardIconInline} />
              <span>Today's Revenue (Online)</span>
            </div>
            <div className={styles.dashboardPage_cardValue}>
              ₹{(revenueByPaymentMode?.ONLINE || revenueByPaymentMode?.UPI || 0).toLocaleString()}
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

                              {usersPerformance.map((user: { username: string }, index: number) => (
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
          <div className={styles.filterContainer}>
            <div></div> {/* Empty div for left side spacing */}
            <div className={styles.filterControls}>
              <button
                className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </button>
              {Object.keys(appliedFilters).length > 0 && (
                <button
                  className={styles.clearFiltersButton}
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Cashier</label>
                <select
                  className={styles.filterSelect}
                  value={filters.cashier}
                  onChange={(e) => handleFilterChange('cashier', e.target.value)}
                >
                  <option value="">All Cashiers</option>
                  {cashiers.map(cashier => (
                    <option key={cashier} value={cashier}>{cashier}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Value Range</label>
                <div className={styles.valueRangeContainer}>
                  <input
                    type="number"
                    className={styles.filterInput}
                    placeholder="Min Value"
                    value={filters.minValue}
                    onChange={(e) => handleFilterChange('minValue', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className={styles.filterInput}
                    placeholder="Max Value"
                    value={filters.maxValue}
                    onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Date Range</label>
                <div className={styles.dateRangeContainer}>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Payment Mode</label>
                <select
                  className={styles.filterSelect}
                  value={filters.paymentMode}
                  onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
                >
                  <option value="">All Payment Modes</option>
                  <option value="CASH">Cash</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>

              <div className={styles.filterActions}>
                <button
                  className={styles.applyFiltersButton}
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
                <button
                  className={styles.clearFiltersButton}
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {Object.keys(appliedFilters).length > 0 && (
            <div className={styles.activeFilters}>
              {Object.entries(appliedFilters).map(([key, value]) => (
                <span key={key} className={styles.activeFilterTag}>
                  {getFilterDisplayName(key, value)}
                  <button
                    className={styles.removeFilterButton}
                    onClick={() => removeFilter(key)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div style={{ width: '100%', minHeight: 480 }}>
           {transactionsLoading ? (
             <div className={styles.dashboardPage_emptyState}>Loading transactions...</div>
           ) : recentTransactions.length === 0 ? (
              <div className={styles.dashboardPage_emptyState}>No recent transactions available.</div>
            ) : (
             <>
               <table className={styles.dashboardPage_table}>
                 <thead style={{ backgroundColor: '#375534', color: 'white' }}>
                   <tr>
                     <th>Cashier</th>
                     <th>Order Id</th>
                     <th>Receipt Id</th>
                     <th>Value</th>
                     <th>Payment Mode</th>
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
                       <td>{tx.payment_mode}</td>
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
               {renderPagination()}
             </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 