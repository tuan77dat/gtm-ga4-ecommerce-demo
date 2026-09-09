import { Product } from '../types';

const createSvgDataUrl = (title: string, bg1: string, bg2: string, icon: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)" />
    <circle cx="300" cy="180" r="80" fill="white" opacity="0.15" />
    <text x="300" y="195" font-family="system-ui, sans-serif" font-size="70" text-anchor="middle">${icon}</text>
    <text x="300" y="320" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" opacity="0.95">${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "SKU-101",
    name: "Aura Noise-Canceling Wireless Headphones",
    price: 199.99,
    category: "Electronics",
    image: createSvgDataUrl("Aura Headphones", "#4f46e5", "#7c3aed", "🎧"),
    description: "Premium over-ear wireless headphones featuring active noise cancellation, 30-hour battery life, and spatial audio support.",
    rating: 4.8,
    stock: 15
  },
  {
    id: "SKU-102",
    name: "Horizon Smart Fitness Watch",
    price: 149.50,
    category: "Electronics",
    image: createSvgDataUrl("Horizon Watch", "#0284c7", "#2563eb", "⌚"),
    description: "Sleek smartwatch with continuous heart rate monitoring, GPS tracking, sleep analytics, and 7-day battery life.",
    rating: 4.6,
    stock: 22
  },
  {
    id: "SKU-103",
    name: "Urban Commuter Minimalist Backpack",
    price: 79.00,
    category: "Accessories",
    image: createSvgDataUrl("Urban Backpack", "#0d9488", "#059669", "🎒"),
    description: "Water-resistant commuter backpack with padded 16-inch laptop compartment, hidden anti-theft pocket, and ergonomic straps.",
    rating: 4.9,
    stock: 18
  },
  {
    id: "SKU-104",
    name: "Pro-Click Mechanical Gaming Keyboard",
    price: 129.99,
    category: "Electronics",
    image: createSvgDataUrl("Pro Mechanical Keyboard", "#d97706", "#dc2626", "⌨️"),
    description: "Hot-swappable RGB mechanical keyboard equipped with tactile switches, PBT keycaps, and ultra-low latency wireless connection.",
    rating: 4.7,
    stock: 12
  },
  {
    id: "SKU-105",
    name: "Glide Ultra-Light Running Shoes",
    price: 110.00,
    category: "Footwear",
    image: createSvgDataUrl("Glide Sneakers", "#ec4899", "#8b5cf6", "👟"),
    description: "Responsive cushion running shoes engineered for daily training and long-distance comfort with breathable mesh upper.",
    rating: 4.5,
    stock: 30
  },
  {
    id: "SKU-106",
    name: "Thermal-Shield All-Weather Jacket",
    price: 165.00,
    category: "Apparel",
    image: createSvgDataUrl("Thermal Jacket", "#374151", "#111827", "🧥"),
    description: "Windproof and rain-resistant insulated jacket built with high-grade breathable fabric for all seasons.",
    rating: 4.8,
    stock: 9
  },
  {
    id: "SKU-107",
    name: "Artisan Ceramic Insulated Coffee Tumbler",
    price: 34.50,
    category: "Home & Kitchen",
    image: createSvgDataUrl("Coffee Tumbler", "#ca8a04", "#b45309", "☕"),
    description: "Double-wall vacuum insulated stainless steel tumbler with ceramic interior coating to preserve pure flavor.",
    rating: 4.9,
    stock: 45
  },
  {
    id: "SKU-108",
    name: "Polarized Titanium Frame Sunglasses",
    price: 89.99,
    category: "Accessories",
    image: createSvgDataUrl("Polarized Sunglasses", "#059669", "#047857", "🕶️"),
    description: "Ultra-lightweight titanium frame sunglasses equipped with UV400 polarized anti-glare lenses.",
    rating: 4.4,
    stock: 20
  }
];
