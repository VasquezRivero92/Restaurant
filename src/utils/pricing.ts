import { MenuItem } from '../types';

export function getEffectivePrice(item: MenuItem, basePrice = item.price, now = new Date()): number {
  const promotion = item.promotion;
  if (!promotion || !promotion.active || now < new Date(promotion.startsAt) || now > new Date(promotion.endsAt)) return basePrice;
  return promotion.type === 'percentage'
    ? Math.max(0, Number((basePrice * (1 - promotion.value / 100)).toFixed(2)))
    : Math.max(0, promotion.value);
}

export function isScheduledForPublication(scheduledAt?: number): boolean {
  return Boolean(scheduledAt && scheduledAt > Date.now());
}
