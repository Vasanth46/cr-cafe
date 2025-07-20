import React from 'react';
import styles from './MenuCategoryTabs.module.css';

interface Category {
  key: string;
  label: string;
}

interface MenuCategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (key: string) => void;
  items: { category?: string; available: boolean }[];
}

const MenuCategoryTabs: React.FC<MenuCategoryTabsProps> = ({ categories, selectedCategory, onSelectCategory, items }) => {
  return (
    <div className={styles.tabs_root}>
      {categories.map(cat => {
        const count = cat.key === 'All'
          ? items.length
          : items.filter(i => i.category === cat.key).length;
        const available = cat.key === 'All'
          ? items.some(i => i.available)
          : items.some(i => i.category === cat.key && i.available);
        const needRestock = cat.key !== 'All' && count > 0 && !available;
        return (
          <button
            key={cat.key}
            className={[
              styles.tab,
              selectedCategory === cat.key && styles['tab--active'],
              !available && styles['tab--disabled']
            ].filter(Boolean).join(' ')}
            onClick={() => onSelectCategory(cat.key)}
            disabled={count === 0}
          >
            <span>{cat.label}</span>
            <span className={styles.tab_count}>{count} Items</span>
            {needRestock && <span className={styles.tab_restock}>Need to restock</span>}
          </button>
        );
      })}
    </div>
  );
};

export default MenuCategoryTabs; 