import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'PKR' | 'USD';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  formatPrice: (pkr: number, usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>('PKR');

  useEffect(() => {
    const saved = localStorage.getItem('kuro_currency') as CurrencyType | null;
    if (saved === 'PKR' || saved === 'USD') {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    localStorage.setItem('kuro_currency', c);
  };

  const formatPrice = (pkr: number, usd: number): string => {
    if (currency === 'USD') {
      return `$${usd}`;
    }
    return `Rs. ${pkr.toLocaleString('en-PK')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
