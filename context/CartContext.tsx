"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useLocale } from "next-intl";
import type { Money, Product, ProductVariant } from "@/lib/types";
import { toShopifyLanguage } from "@/lib/shopify/locale";
import type { Locale } from "@/i18n/routing";
import {
  addToCartAction,
  createCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartLineAction,
} from "@/lib/shopify/cart-actions";

export interface CartLine {
  lineId: string;
  productHandle: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  image: string;
  price: Money;
  quantity: number;
}

/** Keys into the `cart.errors` translation namespace, resolved at render time by CartDrawer. */
export type CartErrorKey = "addToCart" | "removeFromCart" | "updateQuantity";

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  /**
   * Resets local cart state after an order has been placed through the
   * custom checkout, without calling Shopify — the Shopify Cart object
   * backing `checkoutUrl` is simply abandoned, since it's never used for
   * checkout (see AGENTS.md: no Shopify hosted checkout).
   */
  clearCartLocal: () => void;
  subtotal: number;
  itemCount: number;
  /** Shopify's hosted checkout URL for the current cart, or null until a cart exists. Never used for checkout — display/internal only. */
  checkoutUrl: string | null;
  /** True while a cart mutation is in flight. */
  isLoading: boolean;
  /** Translation key for the last failed cart operation, if any. */
  error: CartErrorKey | null;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_STORAGE_KEY = "biofertmaroc_shopify_cart_id";

export function CartProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;
  const language = toShopifyLanguage(locale);

  const [cartId, setCartId] = useState<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<CartErrorKey | null>(null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const applyCart = useCallback(
    (cart: { id: string; checkoutUrl: string; subtotal: number; itemCount: number; lines: CartLine[] } | null) => {
      if (!cart) {
        setCartId(null);
        setLines([]);
        setCheckoutUrl(null);
        setSubtotal(0);
        setItemCount(0);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(CART_ID_STORAGE_KEY);
        }
        return;
      }
      setCartId(cart.id);
      setLines(cart.lines);
      setCheckoutUrl(cart.checkoutUrl);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CART_ID_STORAGE_KEY, cart.id);
      }
    },
    []
  );

  // Hydrate an existing Shopify cart from localStorage on first mount so
  // the cart survives page refreshes.
  useEffect(() => {
    const storedId = window.localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!storedId) return;
    getCartAction(storedId, language)
      .then((cart) => {
        // A null cart means it was completed or expired on Shopify's side.
        if (cart) applyCart(cart);
        else window.localStorage.removeItem(CART_ID_STORAGE_KEY);
      })
      .catch(() => {
        // Stale/invalid cart id — drop it silently and start fresh on next add.
        window.localStorage.removeItem(CART_ID_STORAGE_KEY);
      });
    // Only re-hydrate on mount; the language used here only affects the
    // shape of the returned cart, not whether hydration should re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyCart]);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      setIsOpen(true);
      setIsLoading(true);
      setError(null);
      const run = cartId
        ? addToCartAction(cartId, variant.id, quantity, language)
        : createCartAction(variant.id, quantity, language);
      run
        .then(applyCart)
        .catch(() => setError("addToCart"))
        .finally(() => setIsLoading(false));
    },
    [cartId, applyCart, language]
  );

  const removeItem = useCallback(
    (lineId: string) => {
      if (!cartId) return;
      setIsLoading(true);
      setError(null);
      removeFromCartAction(cartId, lineId, language)
        .then(applyCart)
        .catch(() => setError("removeFromCart"))
        .finally(() => setIsLoading(false));
    },
    [cartId, applyCart, language]
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (!cartId) return;
      setIsLoading(true);
      setError(null);
      const run =
        quantity <= 0
          ? removeFromCartAction(cartId, lineId, language)
          : updateCartLineAction(cartId, lineId, quantity, language);
      run
        .then(applyCart)
        .catch(() => setError("updateQuantity"))
        .finally(() => setIsLoading(false));
    },
    [cartId, applyCart, language]
  );

  const clearCartLocal = useCallback(() => {
    applyCart(null);
  }, [applyCart]);

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCartLocal,
      subtotal,
      itemCount,
      checkoutUrl,
      isLoading,
      error,
    }),
    [
      lines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCartLocal,
      subtotal,
      itemCount,
      checkoutUrl,
      isLoading,
      error,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
