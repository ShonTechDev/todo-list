function FilterInput({ filterTerm, onFilterTermChange }) {
  return (
    <div>
      <label htmlFor="filterTerm">Search todos</label>
      <input
        id="filterTerm"
        type="text"
        value={filterTerm}
        onChange={(event) => onFilterTermChange(event.target.value)}
      />
    </div>
  );
}

export default FilterInput;