import { Product, CartItem, GA4EcommercePayload } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
  * Core tracking helper to push events into window.dataLayer.
  * ALWAYS calls dataLayer.push({ ecommerce: null }) first as per GA4 best practices.
  */
export const pushToDataLayer = (event: string, ecommerce: GA4EcommercePayload | null = null) => {
  window.dataLayer = window.dataLayer || [];

  // Step 1: Clear previous ecommerce object to prevent data bleeding
  window.dataLayer.push({ ecommerce: null });

  // Step 2: Push current event payload
  const payload = ecommerce ? { event, ecommerce } : { event };
  window.dataLayer.push(payload);

  // Dispatch custom window event so on-screen debug panel & toasts update instantly
  window.dispatchEvent(
    new CustomEvent('gtm_data_layer_push', {
      detail: {
        event,
        payload,
        timestamp: new Date().toLocaleTimeString()
      }
    })
  );
};

// --- GA4 Ecommerce Tracking Wrappers ---

export const trackViewItemList = (items: Product[], listId: string = "homepage_grid", listName: string = "Homepage Product Grid") => {
  pushToDataLayer("view_item_list", {
    item_list_id: listId,
    item_list_name: listName,
    items: items.map((product, idx) => ({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      index: idx + 1
    }))
  });
};

export const trackSelectItem = (product: Product, index: number, listId: string = "homepage_grid", listName: string = "Homepage Product Grid") => {
  pushToDataLayer("select_item", {
    item_list_id: listId,
    item_list_name: listName,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        index: index + 1
      }
    ]
  });
};

export const trackViewItem = (product: Product) => {
  pushToDataLayer("view_item", {
    currency: "USD",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }
    ]
  });
};

export const trackAddToCart = (product: Product, quantity: number = 1) => {
  pushToDataLayer("add_to_cart", {
    currency: "USD",
    value: parseFloat((product.price * quantity).toFixed(2)),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity
      }
    ]
  });
};

export const trackRemoveFromCart = (product: Product, quantity: number = 1) => {
  pushToDataLayer("remove_from_cart", {
    currency: "USD",
    value: parseFloat((product.price * quantity).toFixed(2)),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity
      }
    ]
  });
};

export const trackViewCart = (cartItems: CartItem[], total: number) => {
  pushToDataLayer("view_cart", {
    currency: "USD",
    value: parseFloat(total.toFixed(2)),
    items: cartItems.map((item, idx) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
      index: idx + 1
    }))
  });
};

export const trackBeginCheckout = (cartItems: CartItem[], total: number) => {
  pushToDataLayer("begin_checkout", {
    currency: "USD",
    value: parseFloat(total.toFixed(2)),
    items: cartItems.map((item, idx) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
      index: idx + 1
    }))
  });
};

export const trackAddShippingInfo = (cartItems: CartItem[], total: number, shippingTier: string = "Standard Express") => {
  pushToDataLayer("add_shipping_info", {
    currency: "USD",
    value: parseFloat(total.toFixed(2)),
    shipping_tier: shippingTier,
    items: cartItems.map((item, idx) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
      index: idx + 1
    }))
  });
};

export const trackAddPaymentInfo = (cartItems: CartItem[], total: number, paymentType: string = "Credit Card") => {
  pushToDataLayer("add_payment_info", {
    currency: "USD",
    value: parseFloat(total.toFixed(2)),
    payment_type: paymentType,
    items: cartItems.map((item, idx) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
      index: idx + 1
    }))
  });
};

export const trackPurchase = (
  cartItems: CartItem[],
  total: number,
  transactionId: string,
  tax: number = 0,
  shipping: number = 5.0
) => {
  pushToDataLayer("purchase", {
    transaction_id: transactionId,
    value: parseFloat(total.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    currency: "USD",
    items: cartItems.map((item, idx) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
      index: idx + 1
    }))
  });
};
