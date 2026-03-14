import { useState, useEffect } from "react";
import { Currency, useCurrency } from "@/hooks/useCurrency";

interface CurrencySelectorProps {
  value?: string;
  onChange: (currencyCode: string) => void;
  label?: string;
}

export function CurrencySelector({ value, onChange, label }: CurrencySelectorProps) {
  const { getCurrencies, getDefault } = useCurrency();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selected, setSelected] = useState<string>(value || "NGN");

  useEffect(() => {
    const load = async () => {
      const [list, defaultCurrency] = await Promise.all([
        getCurrencies(),
        getDefault(),
      ]);
      setCurrencies(list);
      if (!value && defaultCurrency) {
        setSelected(defaultCurrency.code);
        onChange(defaultCurrency.code);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelected(newValue);
    onChange(newValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={selected}
        onChange={handleChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CurrencyDisplayProps {
  amount: number;
  currencyCode?: string;
  showCode?: boolean;
}

export function CurrencyDisplay({ amount, currencyCode = "NGN", showCode = false }: CurrencyDisplayProps) {
  const { convert, format } = useCurrency();
  const [displayAmount, setDisplayAmount] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const result = await convert(amount, currencyCode, currencyCode);
      if (result) {
        setDisplayAmount(showCode ? `${result.formatted} ${currencyCode}` : result.formatted);
      } else {
        setDisplayAmount(`${currencyCode} ${amount.toFixed(2)}`);
      }
    };
    load();
  }, [amount, currencyCode, convert, showCode]);

  return <span>{displayAmount || `${currencyCode} ${amount.toFixed(2)}`}</span>;
}
