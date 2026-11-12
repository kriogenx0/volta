// The made-up content of the example pages: people, numbers, orders and settings. Static, so
// the pages read the same every time and nothing here touches a server.

export const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' }
];

export const PEOPLE = [
  { name: 'Ada Lovelace', email: 'ada@analytical.example', role: 'Admin', tone: 'info' },
  { name: 'Grace Hopper', email: 'grace@navy.example', role: 'Editor', tone: 'success' },
  { name: 'Alan Turing', email: 'alan@bletchley.example', role: 'Editor', tone: 'success' },
  { name: 'Katherine Johnson', email: 'katherine@nasa.example', role: 'Viewer', tone: 'neutral' },
  { name: 'Margaret Hamilton', email: 'margaret@apollo.example', role: 'Viewer', tone: 'neutral' },
  { name: 'Linus Torvalds', email: 'linus@kernel.example', role: 'Viewer', tone: 'neutral' }
];

export const STATS = [
  { label: 'Revenue', value: '$48,290', change: '+12.4%', tone: 'success' },
  { label: 'New customers', value: '1,284', change: '+6.1%', tone: 'success' },
  { label: 'Open tickets', value: '37', change: '-8.0%', tone: 'success' },
  { label: 'Refunds', value: '14', change: '+2.3%', tone: 'danger' }
];

export const GOALS = [
  { label: 'Quarterly revenue', percent: 72 },
  { label: 'Customer satisfaction', percent: 91 },
  { label: 'Support response time', percent: 48 }
];

export const ACTIVITY = [
  { name: 'Grace Hopper', text: 'published "Launch checklist"', when: '2 minutes ago' },
  { name: 'Alan Turing', text: 'closed 4 tickets', when: '38 minutes ago' },
  { name: 'Ada Lovelace', text: 'invited a new member', when: 'Yesterday' },
  { name: 'Katherine Johnson', text: 'updated the billing address', when: '2 days ago' }
];

export const ORDERS = [
  { id: '#10482', customer: 'Ada Lovelace', date: 'Nov 12, 2026', total: '$240.00', status: 'Paid' },
  { id: '#10481', customer: 'Grace Hopper', date: 'Nov 11, 2026', total: '$89.50', status: 'Pending' },
  { id: '#10480', customer: 'Alan Turing', date: 'Nov 11, 2026', total: '$1,120.00', status: 'Paid' },
  { id: '#10479', customer: 'Katherine Johnson', date: 'Nov 9, 2026', total: '$32.00', status: 'Refunded' },
  { id: '#10478', customer: 'Margaret Hamilton', date: 'Nov 8, 2026', total: '$410.25', status: 'Pending' },
  { id: '#10477', customer: 'Linus Torvalds', date: 'Nov 7, 2026', total: '$68.00', status: 'Paid' }
];

// Order status -> the Badge tone that shows it
export const STATUS_TONES = { Paid: 'success', Pending: 'warning', Refunded: 'neutral' };

export const ORDER_FILTERS = ['All', 'Paid', 'Pending', 'Refunded'];

export const NOTIFICATIONS = [
  { key: 'comments', label: 'Comments and mentions', defaultOn: true },
  { key: 'digest', label: 'Weekly summary email', defaultOn: true },
  { key: 'product', label: 'Product news', defaultOn: false },
  { key: 'security', label: 'Security alerts', defaultOn: true }
];

export const SETTINGS_TABS = ['Profile', 'Notifications', 'Danger zone'];
