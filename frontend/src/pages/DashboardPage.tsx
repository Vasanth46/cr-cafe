import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import styles from './DashboardPage.module.css';

const cafeColors = ['#0F2A1D', '#375534', '#6B9071', '#AEC3B0', '#E3EED4'];

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('day');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.getSummary(),
      dashboardService.getTopItems(),
      dashboardService.getRevenue(range),
    ]).then(([summary, topItems, revenue]) => {
      setSummary(summary);
      setTopItems(topItems);
      setRevenue(revenue);
    }).finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className={styles.dashboardPage_root}>Loading dashboard...</div>;

  return (
    <div className={styles.dashboardPage_root}>
      <div className={styles.dashboardPage_cards}>
        <div className={styles.dashboardPage_card}>
          <div className={styles.dashboardPage_cardTitle}>Total Revenue</div>
          <div className={styles.dashboardPage_cardValue}>${summary?.totalRevenue?.toLocaleString() || 0}</div>
          <div className={styles.dashboardPage_cardChange}>+{summary?.revenueChange || 0}%</div>
        </div>
        <div className={styles.dashboardPage_card}>
          <div className={styles.dashboardPage_cardTitle}>Today Sales</div>
          <div className={styles.dashboardPage_cardValue}>{summary?.todaySales || 0}</div>
        </div>
        <div className={styles.dashboardPage_card}>
          <div className={styles.dashboardPage_cardTitle}>Orders</div>
          <div className={styles.dashboardPage_cardValue}>{summary?.orders || 0}</div>
        </div>
        <div className={styles.dashboardPage_card}>
          <div className={styles.dashboardPage_cardTitle}>Complaints</div>
          <div className={styles.dashboardPage_cardValue}>{summary?.complaints || 0}</div>
        </div>
      </div>
      <div className={styles.dashboardPage_grid}>
        <div className={styles.dashboardPage_section} style={{ gridColumn: 'span 2' }}>
          <div className={styles.dashboardPage_sectionTitle}>Sales Statistic</div>
          <select style={{ marginBottom: 16 }} value={range} onChange={e => setRange(e.target.value)}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenue}>
              <XAxis dataKey="label" stroke="#375534" />
              <YAxis stroke="#375534" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="coffee" stroke="#0F2A1D" name="Coffee" />
              <Line type="monotone" dataKey="tea" stroke="#6B9071" name="Tea" />
              <Line type="monotone" dataKey="snack" stroke="#AEC3B0" name="Snack" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.dashboardPage_section}>
          <div className={styles.dashboardPage_sectionTitle}>Top Selling Items</div>
          <PieChart width={200} height={200}>
            <Pie data={topItems} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#0F2A1D" label>
              {topItems.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={cafeColors[idx % cafeColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
      <div className={styles.dashboardPage_grid}>
        <div className={styles.dashboardPage_section}>
          <div className={styles.dashboardPage_sectionTitle}>Items Performance</div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={topItems} outerRadius={90}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Sales" dataKey="sales" stroke="#375534" fill="#375534" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.dashboardPage_section}>
          <div className={styles.dashboardPage_sectionTitle}>Recent Transactions</div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.dashboardPage_table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {summary?.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id}>
                    <td>{tx.customerName}</td>
                    <td>{tx.items?.join(', ')}</td>
                    <td>${tx.value?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 