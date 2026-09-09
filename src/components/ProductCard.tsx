import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { trackSelectItem } from '../utils/gtm';

interface ProductCardProps {
  product: Product;
  index: number;
  listId?: string;
  listName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  listId = 'homepage_grid',
  listName = 'Homepage Product Grid'
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering card click if add to cart button was pressed
    if ((e.target as HTMLElement).closest('.add-to-cart-btn')) return;

    trackSelectItem(product, index, listId, listName);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
            {product.category}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-indigo-600 text-white font-medium text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5" /> View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">SKU: {product.id}</span>
          </div>

          <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 text-base leading-snug mb-2">
            {product.name}
          </h3>

          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-700/40 mt-auto pt-4">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Price</span>
          <span className="text-lg font-extrabold text-white font-mono">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="add-to-cart-btn px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors active:scale-95 shadow-md shadow-indigo-600/20"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
