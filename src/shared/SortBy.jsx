function SortBy({
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) {
  return (
    <div>
      <label htmlFor="sortBy">Sort by</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value="creationDate">Creation Date</option>
        <option value="title">Title</option>
      </select>

      <label htmlFor="sortDirection">Direction</label>
      <select
        id="sortDirection"
        value={sortDirection}
        onChange={(event) => setSortDirection(event.target.value)}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}

export default SortBy;