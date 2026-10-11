/** Where a custom order is in its life, in the order they usually happen. */
export const ORDER_STATUSES = [
  { id: 'pending', label: 'New', color: '#E8A04B' },
  { id: 'quoted', label: 'Price sent', color: '#B38CFF' },
  { id: 'paid', label: 'Paid', color: '#4DA3FF' },
  { id: 'crafting', label: 'Crafting', color: '#E8A0B4' },
  { id: 'shipped', label: 'Shipped', color: '#2FB6C9' },
  { id: 'completed', label: 'Completed', color: '#3DBE77' },
  { id: 'cancelled', label: 'Cancelled', color: '#8A8A8A' },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]['id'];

export function isOrderStatus(s: unknown): s is OrderStatus {
  return typeof s === 'string' && ORDER_STATUSES.some((x) => x.id === s);
}

/** wa.me needs the full international number; Indian 10-digit numbers get +91. */
export function customerWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, '').replace(/^0+/, '');
  return digits.length === 10 ? `91${digits}` : digits;
}
