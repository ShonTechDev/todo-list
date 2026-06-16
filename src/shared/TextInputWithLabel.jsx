import styles from '../App.module.css';

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  value,
  ...inputProps
}) {
  return (
    <div className={styles['input-group']}>
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