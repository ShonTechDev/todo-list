function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div>
      <label htmlFor="filterInput">Search todos:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        placeholder="Search by title..."
        onChange={(event) => onFilterChange(event.target.value)}
      />
    </div>
  );
}

export default FilterInput;