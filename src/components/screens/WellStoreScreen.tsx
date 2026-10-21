import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StoreProduct, StoreCategory } from '../../types';
import { sampleProducts } from '../../data/mockData';
import {
  ShoppingBag,
  Search,
  Heart,
  Star,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  X,
  Truck,
  Check,
  Plus,
  Package,
  History,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const WellStoreScreen: React.FC = () => {
  const {
    profile,
    addToCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
    setIsCheckoutOpen,
    orders,
    setActiveOrderForTracking,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<'All' | StoreCategory>('All');

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [viewingOrders, setViewingOrders] = useState<boolean>(false);

  // Brands list
  const allBrands = ['All', ...Array.from(new Set(sampleProducts.map((p) => p.brand)))];

  // Filtering products
  const filteredProducts = sampleProducts.filter((product) => {
    if (activeCategory !== 'All' && product.category !== activeCategory) return false;
    if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchBestFor = product.bestFor.some((b) => b.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchCategory && !matchBestFor) return false;
    }
    return true;
  });

  // Helper: Personalized recommendation badge
  const isRecommendedForUser = (prod: StoreProduct) => {
    return prod.bestFor.some(
      (tag) =>
        tag.toLowerCase() === profile.skinType.toLowerCase() ||
        tag.toLowerCase() === profile.scalpType.toLowerCase() ||
        profile.skinConcerns.some((c) => c.toLowerCase() === tag.toLowerCase()) ||
        profile.hairConcerns.some((c) => c.toLowerCase() === tag.toLowerCase())
    );
  };

  const handleBuyNow = (product: StoreProduct) => {
    addToCart(product, 1);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Store Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <NestyMascot mood="happy" size="md" animate={true} />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
              SC5 • Curated Well Store ({sampleProducts.length} Products)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Pure Wellness & Menstrual Essentials
            </h1>
            <p className="text-xs sm:text-sm text-pink-100 max-w-xl mt-0.5">
              Science-backed barrier skincare, density hair elixirs, certified bamboo pads, and clean cycle supplements.
            </p>
          </div>
        </div>

        {/* Orders History & Cart Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setViewingOrders(!viewingOrders)}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            <span>{viewingOrders ? 'Back to Catalog' : `Order History (${orders.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-pink-50 transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-pink-600" />
            <span>Open Cart</span>
          </button>
        </div>
      </div>

      {/* Simulated Sandbox Badge */}
      <div className="p-3.5 rounded-2xl bg-violet-50/80 border border-violet-100 flex items-center justify-between text-xs text-violet-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-600" />
          <span>Demo Commerce Sandbox: No real payments charged. Instant simulated express fulfillment.</span>
        </div>
        <span className="font-bold hidden sm:inline">Use code "NESTLOVE" for 15% off</span>
      </div>

      {/* ORDER HISTORY VIEW */}
      {viewingOrders ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Your Demo Order History</h3>
              <p className="text-xs text-slate-400">Track and review all packages placed during your session</p>
            </div>
            <button
              type="button"
              onClick={() => setViewingOrders(false)}
              className="text-xs font-bold text-pink-600 hover:text-pink-700"
            >
              ← Back to Products
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No orders placed yet</h4>
              <p className="text-xs text-slate-400 mt-1">Add items to cart and complete checkout to test simulated delivery tracking.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{order.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.items.length} items • Total: <strong>₹{order.total}</strong> ({order.paymentMethod})
                    </p>
                    <p className="text-[11px] text-slate-400">{order.date}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveOrderForTracking(order)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-pink-400" />
                    <span>Live Tracking</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Search & Filter Controls */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 space-y-4">
            {/* Search Input & Brand Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ingredient, brand, or concern (e.g. Ceramide, Biotin, Pads)..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 shrink-0">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  {allBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1">
              {[
                'All',
                'Skin Care',
                'Hair Care',
                'Period Essentials',
                'Herbal Teas',
                'Aromatherapy',
                'Sleep & Recovery',
                'Superfoods & Seeds',
                'Body & Intimate',
                'Medicines',
                'Supplements',
                'Wellness Tools',
              ].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-extrabold text-slate-800">
                Products in {activeCategory} ({filteredProducts.length})
              </h3>
              <span className="text-xs text-slate-400 font-semibold">100% Verified Quality</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-pink-100">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No products match your search</h4>
                <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    setSelectedBrand('All');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((prod) => {
                  const wishlisted = isWishlisted(prod.id);
                  const isRecommended = isRecommendedForUser(prod);

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-3xl overflow-hidden border border-pink-100/80 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all flex flex-col justify-between group relative"
                    >
                      {/* Top Badges */}
                      <div className="relative h-48 overflow-hidden bg-slate-50 cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        {/* Recommendation pill */}
                        {isRecommended && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Recommended for You</span>
                          </span>
                        )}

                        {/* Wishlist toggle button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod.id);
                          }}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
                            wishlisted
                              ? 'bg-pink-500 text-white'
                              : 'bg-white/80 backdrop-blur-md text-slate-600 hover:text-pink-600'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <span>{prod.brand}</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{prod.rating}</span>
                              <span className="text-slate-400">({prod.reviewCount})</span>
                            </div>
                          </div>

                          <h4
                            onClick={() => setSelectedProduct(prod)}
                            className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-pink-600 transition cursor-pointer leading-snug"
                          >
                            {prod.name}
                          </h4>

                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {prod.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-extrabold text-slate-900">
                              ₹{prod.price}
                            </span>
                            {prod.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{prod.originalPrice}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(prod, 1)}
                            className="px-3.5 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white font-bold text-xs transition flex items-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="relative h-56 sm:h-64">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold">
                  {selectedProduct.brand}
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold">
                  ₹{selectedProduct.price}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">
                  {selectedProduct.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                  {selectedProduct.name}
                </h3>
                <p className="text-slate-600 mt-2 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Consultation Warning if present */}
              {selectedProduct.cautionNotice && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-tight text-[11px] font-medium">{selectedProduct.cautionNotice}</p>
                </div>
              )}

              {/* Benefits */}
              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Key Benefits
                </h4>
                <div className="space-y-1.5">
                  {selectedProduct.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Active Ingredients
                </h4>
                <p className="text-slate-500 leading-relaxed italic">{selectedProduct.ingredients}</p>
              </div>

              {/* How to use */}
              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  How to Use
                </h4>
                <p className="text-slate-600 leading-relaxed">{selectedProduct.howToUse}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-pink-200 text-pink-700 hover:bg-pink-50 font-bold text-xs transition"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => handleBuyNow(selectedProduct)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
              >
                Buy Now (₹{selectedProduct.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
