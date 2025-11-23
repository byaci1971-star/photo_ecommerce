/**
 * Stripe product and price configuration
 * These are used to create Stripe checkout sessions
 */

export const stripeProducts = {
  photos: {
    name: 'Photo Prints',
    description: 'High-quality photo prints in various sizes',
    prices: {
      '10x15': { amount: 299, currency: 'chf', label: '10x15 cm' },
      '13x18': { amount: 399, currency: 'chf', label: '13x18 cm' },
      '20x25': { amount: 699, currency: 'chf', label: '20x25 cm' },
      '21x30': { amount: 799, currency: 'chf', label: '21x30 cm (A4)' },
      '30x40': { amount: 1299, currency: 'chf', label: '30x40 cm' },
    },
  },
  photoBooks: {
    name: 'Photo Books',
    description: 'Personalized photo books with hardcover',
    prices: {
      small: { amount: 2999, currency: 'chf', label: 'Small Format' },
      standard: { amount: 4999, currency: 'chf', label: 'Standard Format' },
      large: { amount: 6999, currency: 'chf', label: 'Large Format' },
    },
  },
  calendars: {
    name: 'Photo Calendars',
    description: 'Personalized photo calendars',
    prices: {
      wall: { amount: 1999, currency: 'chf', label: 'Wall Calendar' },
      desk: { amount: 1499, currency: 'chf', label: 'Desk Calendar' },
    },
  },
  gifts: {
    name: 'Photo Gifts',
    description: 'Personalized gifts with your photos',
    prices: {
      mug: { amount: 999, currency: 'chf', label: 'Personalized Mug' },
      cushion: { amount: 1999, currency: 'chf', label: 'Photo Cushion' },
      tshirt: { amount: 1499, currency: 'chf', label: 'Photo T-shirt' },
    },
  },
};

export function getProductPrice(category: string, size: string): number | null {
  const categoryPrices = (stripeProducts as any)[category]?.prices;
  if (!categoryPrices) return null;
  return categoryPrices[size]?.amount || null;
}
