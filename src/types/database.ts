export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  product_name: string;
  name: string; // fallback alias for UI
  brand: string;
  sku: string;
  size?: string | number | number[];
  color?: string | string[];
  sizes: (number | string)[];
  colors: string[];
  size_display: string;
  color_display: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_featured?: boolean;
  created_at?: string;
  categories?: Category;
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
}

export interface Order {
  id?: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: 'transfer' | 'qris' | 'cod' | 'credit_card';
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size: string | number;
  color: string;
  subtotal: number;
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at?: string;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  product: Product;
  size: string | number;
  color: string;
  quantity: number;
}
