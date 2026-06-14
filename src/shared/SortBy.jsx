import styles from '../App.module.css';

function SortBy({
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}) {
  return (
    <div className={styles['control-group']}>
      <label htmlFor="sortBy">Sort by</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(event) => onSortByChange(event.target.value)}
      >
        <option value="createdDate">Creation Date</option>
        <option value="title">Title</option>
      </select>

      <label htmlFor="sortDirection">Order</label>
      <select
        id="sortDirection"
        value={sortDirection}
        onChange={(event) => onSortDirectionChange(event.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

export default SortBy;