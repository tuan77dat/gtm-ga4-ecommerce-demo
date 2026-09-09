import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { trackViewItem } from '../utils/gtm';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, ShoppingCart, Star, CheckCircle2 } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);
  const hasFiredRef = useRef<string | null>(null);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  useEffect(() => {
    if (product && hasFiredRef.current !== product.id) {
      // Fire GA4 view_item event when product page loads
      trackViewItem(product);
      hasFiredRef.current = product.id;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <p className="text-slate-400 mb-6">The requested SKU standard item was not found.</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const relatedProducts = MOCK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold inline-flex items-center gap-2 transition-colors border border-slate-700/60"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Listing
      </button>

      {/* Main Detail Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mb-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[450px] object-contain rounded-xl"
          />
          <div className="absolute top-4 left-4 bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur">
            {product.category}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                SKU: {product.id}
              </span>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating} / 5.0 Rating</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-extrabold text-indigo-400 font-mono mb-6">
              ${product.price.toFixed(2)}
            </div>

            <div className="border-t border-b border-slate-800 py-4 mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Event fired banner */}
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-3 mb-6 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-xs">
                <span className="text-slate-400">Triggered GA4 Event on Mount: </span>
                <code className="text-emerald-400 font-mono font-bold">view_item</code>
              </div>
            </div>
          </div>

          {/* Add to Cart Control Box */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <label className="text-xs font-bold text-slate-300">Quantity:</label>
              <select
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="bg-slate-800 text-white font-mono text-sm border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400">In Stock ({product.stock} available)</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-98 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Add {quantity} to Cart (${(product.price * quantity).toFixed(2)})
            </button>

            {addedToast && (
              <div className="mt-3 p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Added to cart & <code className="font-mono">add_to_cart</code> dataLayer event pushed!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Widget */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Related Products</h3>
            <p className="text-xs text-slate-400">
              Clicking items here triggers <code className="text-amber-400 font-mono">select_item</code> with <code className="text-amber-400 font-mono">item_list_id: "related_products"</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relProd, idx) => (
            <ProductCard
              key={relProd.id}
              product={relProd}
              index={idx}
              listId="related_products"
              listName="Related Products Widget"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
