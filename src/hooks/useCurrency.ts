import api from "../lib/axios";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate: number;
  formatted: string;
}

export const currencyApi = {
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await api.get("/currencies");
    return response.data.data;
  },

  getDefaultCurrency: async (): Promise<Currency> => {
    const response = await api.get("/currencies/default");
    return response.data.data;
  },

  convert: async (
    amount: number,
    from: string,
    to: string
  ): Promise<ConversionResult> => {
    const response = await api.get("/currencies/convert", {
      params: { amount, from, to },
    });
    return response.data.data;
  },

  getCurrency: async (code: string): Promise<Currency> => {
    const response = await api.get(`/currencies/${code}`);
    return response.data.data;
  },
};

export const useCurrency = () => {
  const getCurrencies = async () => {
    try {
      return await currencyApi.getCurrencies();
    } catch {
      return [];
    }
  };

  const getDefault = async () => {
    try {
      return await currencyApi.getDefaultCurrency();
    } catch {
      return { code: "NGN", symbol: "₦", name: "Nigerian Naira" };
    }
  };

  const convert = async (amount: number, from: string, to: string) => {
    try {
      return await currencyApi.convert(amount, from, to);
    } catch {
      return null;
    }
  };

  const format = async (amount: number, currencyCode: string) => {
    const result = await currencyApi.convert(amount, currencyCode, currencyCode);
    return result?.formatted || `${currencyCode} ${amount.toFixed(2)}`;
  };

  return { getCurrencies, getDefault, convert, format };
};
