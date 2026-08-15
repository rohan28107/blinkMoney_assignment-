export const MOCK_PORTFOLIO = {
  invested: 76500,
  current: 84320,
  dailySip: 150,
};

export function portfolioGain() {
  const gain = MOCK_PORTFOLIO.current - MOCK_PORTFOLIO.invested;
  const gainPercent = (gain / MOCK_PORTFOLIO.invested) * 100;
  return { gain, gainPercent };
}
