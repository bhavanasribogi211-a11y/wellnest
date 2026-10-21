import React from 'react';
import { useApp } from '../../context/AppContext';
import { sampleProducts } from '../../data/mockData';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart, setIsCartOpen } =
    useApp();

  if (!isWishlistOpen) return null;

  const wishlistedItems = sampleProducts.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: typeof sampleProducts[0]) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-violet-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Your Wellness Wishlist</h2>
              <p className="text-xs text-slate-400">
                {wishlistedItems.length} {wishlistedItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-400 mx-auto flex items-center justify-center mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Your wishlist is empty</h3>
              <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any product in the Well Store to save it here.</p>
            </div>
          ) : (
            wishlistedItems.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-pink-200 bg-white transition group"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-16 h-16 object-cover rounded-xl shrink-0 bg-slate-50 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-extrabold text-slate-900">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{prod.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(prod)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 font-bold text-xs transition"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(prod.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                wishlistedItems.forEach((p) => addToCart(p, 1));
                setIsWishlistOpen(false);
                setIsCartOpen(true);
              }}
              className="text-xs font-bold text-pink-600 hover:text-pink-700"
            >
              Move All to Cart
            </button>
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
