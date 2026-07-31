export function AmountSelector({
  presets,
  amount,
  error,
  onPreset,
  onChange,
  onCustomAmountConfirmed,
}: {
  presets: number[];
  amount: string;
  error?: string;
  onPreset: (amount: number) => void;
  onChange: (amount: string) => void;
  onCustomAmountConfirmed: () => void;
}) {
  const numericAmount = Number(amount);

  return (
    <>
      <fieldset className="fieldset">
        <legend>Choose an amount</legend>
        <div className="amount-grid donation-amount-grid">
          {presets.map((preset) => (
            <button
              className={numericAmount === preset ? "selected" : ""}
              type="button"
              key={preset}
              onClick={() => onPreset(preset)}
              aria-pressed={numericAmount === preset}
            >
              HK${preset.toLocaleString("en-HK")}
            </button>
          ))}
        </div>
      </fieldset>

      <label className={`field ${error ? "field-error" : ""}`}>
        <span className="field-label">Or enter another HKD amount</span>
        <div className="currency-input">
          <span aria-hidden="true">HK$</span>
          <input
            aria-label="Custom donation amount"
            type="number"
            inputMode="numeric"
            min="10"
            max="1000000"
            step="1"
            value={amount}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onCustomAmountConfirmed}
            aria-describedby={error ? "donation-amount-error" : undefined}
          />
        </div>
        {error && (
          <span className="field-message" id="donation-amount-error">
            {error}
          </span>
        )}
      </label>
    </>
  );
}
