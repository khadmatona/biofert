export enum OrderStatus {
  PENDING_CONFIRMATION = "pending_confirmation",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  PROCESSING = "processing",
  FULFILLED = "fulfilled",
}

/** Allowed local-status transitions, enforced by orders.service.ts. */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING_CONFIRMATION]: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  [OrderStatus.REJECTED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.FULFILLED]: [],
};
