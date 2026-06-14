function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  value,
  ...inputProps
}) {
  return (
    <div className="input-group">
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
    </div>
  );
}

export default TextInputWithLabel;