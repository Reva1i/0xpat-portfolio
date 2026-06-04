export const STATS = [
  {
    label: 'Peak DEX Volume',
    value: 12.16,
    unit: 'B',
    prefix: '$',
    sublabel: 'PancakeSwap on Base · 2025',
  },
  {
    label: 'TVL Sourced',
    value: 10,
    unit: 'M+',
    prefix: '$',
    sublabel: '2025–2026 · Base, BNBChain, Monad',
  },
  {
    label: 'Protocol Revenue',
    value: 1.2,
    unit: 'M',
    prefix: '$',
    decimals: 1,
    sublabel: 'Generated via IDO pools · BNBChain',
  },
  {
    label: 'Profitability Improved',
    value: 124,
    unit: '%',
    prefix: '',
    sublabel: 'From –74K to +17K CAKE/mo · Base',
  },
]

export const DEAL_GROUPS = [
  {
    year: '2026',
    deals: [
      { protocol: 'U', chain: 'BNBChain', tvl: '$20M', coordinated: true },
      { protocol: 'APYx', chain: 'Base', tvl: '$2M' },
      { protocol: 'earnAUSD', chain: 'Base', tvl: '$1M' },
      { protocol: 'Overnight USD', chain: 'Base', tvl: '$1M' },
      { protocol: 'HeyELSA', chain: 'Base', tvl: '$500K' },
      { protocol: 'VELVET', chain: 'Base', tvl: '$700K' },
      { protocol: 'tGBP', chain: 'Base', tvl: '$250K' },
      { protocol: 'CADC', chain: 'Base', tvl: '$250K' },
      { protocol: 'IDRX', chain: 'Base', tvl: '$20K' },
      { protocol: 'BRZ', chain: 'Base', tvl: '$20K' },
      { protocol: 'AUDF', chain: 'Base', tvl: '$150K' },
    ],
  },
  {
    year: '2025',
    deals: [
      { protocol: 'MEW', chain: 'SOL', tvl: '$1.3M' },
      { protocol: 'ZEUS', chain: 'SOL', tvl: '$1.1M' },
      { protocol: 'VELVET', chain: 'Base', tvl: '$300K' },
      { protocol: 'AUKI', chain: 'Base', tvl: '$250K' },
      { protocol: 'BIO', chain: 'Base', tvl: '$250K' },
      { protocol: 'DEGEN', chain: 'Base', tvl: '$250K' },
      { protocol: 'EDEL', chain: 'Base', tvl: '$150K' },
      { protocol: 'TROLL', chain: 'SOL', tvl: '$100K' },
      { protocol: 'FACY', chain: 'Base', tvl: '$50K' },
    ],
  },
]

export const DEALS = DEAL_GROUPS.flatMap(g => g.deals)

export const SYRUP_PARTNERS = [
  { name: 'U', rewards: '$50K', highlight: true },
  { name: 'DeepNode', rewards: '$30K', highlight: true },
]

export const VOLUME_DATA = [
  { month: 'Jun 25', volume: 3.63,  profit: -81523,  baseTotal: 18 },
  { month: 'Jul 25', volume: 7.82,  profit: -106798, baseTotal: 28 },
  { month: 'Aug 25', volume: 10.71, profit: -116729, baseTotal: 35 },
  { month: 'Sep 25', volume: 7.08,  profit: -214460, baseTotal: 25 },
  { month: 'Oct 25', volume: 12.21, profit: -91924,  baseTotal: 53 },
  { month: 'Nov 25', volume: 8.73,  profit: -80167,  baseTotal: 32 },
  { month: 'Dec 25', volume: 7.43,  profit: -83597,  baseTotal: 28 },
  { month: 'Jan 26', volume: 6.97,  profit: -76407,  baseTotal: 30 },
  { month: 'Feb 26', volume: 5.65,  profit: -6033,   baseTotal: 24 },
  { month: 'Mar 26', volume: 5.91,  profit: 19418,   baseTotal: 22 },
  { month: 'Apr 26', volume: 4.18,  profit: 26146,   baseTotal: 20 },
  { month: 'May 26', volume: 3.50,  profit: null,    baseTotal: 18 },
]
