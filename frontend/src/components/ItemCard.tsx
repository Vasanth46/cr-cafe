import React from 'react';
import type { MenuItem } from '../types';
import styles from './ItemCard.module.css';
import character from '../assets/character.png';
import banner from '../assets/banner.png';

interface ItemCardProps {
  item: MenuItem;
  onAdd: () => void;
}

const placeholder = 'https://via.placeholder.com/80x80?text=No+Image';

const getImageUrl = (item: MenuItem): string => {
  return item.imageUrl?.trim() || placeholder;
};
const ItemCard: React.FC<ItemCardProps> = ({ item, onAdd }) => {
  return (
    <div className={item.available ? styles.itemCard_root : `${styles.itemCard_root} ${styles['itemCard_root--unavailable']}`}
      >
      <div className={styles.itemCard_imageWrap}>
        <img
            src={getImageUrl(item)}
            alt={item.name}
            className={styles.itemCard_image}
        />
      </div>
      <div className={styles.itemCard_bottomRow}>
        <div>
          <div className={styles.itemCard_name}>{item.name}</div>
          <div className={styles.itemCard_price}>₹{item.price.toFixed(2)}</div>
        </div>
        <button
          className={styles.itemCard_addButton}
          onClick={onAdd}
          disabled={!item.available}
          aria-label={`Add ${item.name}`}
        >
          +
        </button>
      </div>
      {!item.available && <div className={styles.itemCard_outOfStock}>Out of stock</div>}
    </div>
  );
};

export default ItemCard; 