import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const copyByLang = {
  en: {
    chooseAmount: "Choose an amount",
    orEnterAnother: "Or enter another HKD amount",
    customAmountAria: "Custom donation amount",
  },
  zh: {
    chooseAmount: "選擇捐款金額",
    orEnterAnother: "或輸入其他港元金額",
    customAmountAria: "自訂捐款金額",
  },
} as const;

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
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);
  const numericAmount = Number(amount);

  return (
    <>
      <fieldset className="fieldset">
        <legend>{copy.chooseAmount}</legend>
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
        <span className="field-label">{copy.orEnterAnother}</span>
        <div className="currency-input">
          <span aria-hidden="true">HK$</span>
          <input
            aria-label={copy.customAmountAria}
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
