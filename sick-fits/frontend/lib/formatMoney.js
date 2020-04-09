import currency from 'currency.js';

const formatterOptions = {
  style: 'currency',
  currency: 'GBP',
};

const formatterFractions = new Intl.NumberFormat('en-GB', {
  ...formatterOptions,
  minimumFractionDigits: 2,
});

const formatterNoFractions = new Intl.NumberFormat('en-GB', {
  ...formatterOptions,
  minimumFractionDigits: 0,
});

export default function(amount) {
  const { value } = currency(amount / 100, {
    formatWithSymbol: true,
    symbol: '£',
  });

  // if its a whole amount, leave off the .00
  if (value % 1 === 0) {
    return formatterNoFractions.format(value);
  }
  return formatterFractions.format(value);
}
