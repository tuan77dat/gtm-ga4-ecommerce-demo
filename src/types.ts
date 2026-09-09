export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GA4Item {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity?: number;
  index?: number;
  item_list_id?: string;
  item_list_name?: string;
}

export interface GA4EcommercePayload {
  currency?: string;
  value?: number;
  transaction_id?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  shipping_tier?: string;
  payment_type?: string;
  item_list_id?: string;
  item_list_name?: string;
  items?: GA4Item[];
}

export interface LoggedDataLayerEvent {
  id: string;
  event: string;
  timestamp: string;
  payload: Record<string, any>;
}
