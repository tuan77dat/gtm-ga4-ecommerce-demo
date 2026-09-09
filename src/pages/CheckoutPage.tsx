import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase
} from '../utils/gtm';
import {
  CheckCircle2,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    address: '123 Innovation Way',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    shippingTier: 'Standard Ground ($5.00)',
    paymentType: 'Credit Card'
  });

  const hasFiredBeginCheckout = useRef(false);

  const grandTotal = cartTotal + 5 + cartTotal * 0.08;

  useEffect(() => {
    // 1. Trigger begin_checkout ONCE on page mount
    if (!hasFiredBeginCheckout.current && cartItems.length > 0) {
      trackBeginCheckout(cartItems, grandTotal);
      hasFiredBeginCheckout.current = true;
    }
  }, [cartItems, grandTotal]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">No Items to Checkout</h2>
        <p className="text-slate-400 text-sm mb-6">Please add products to your cart before proceeding to checkout.</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Product Listing
        </Link>
      </div>
    );
  }

  // Step 1: Submit Shipping -> Trigger add_shipping_info
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackAddShippingInfo(cartItems, grandTotal, formData.shippingTier);
    setCurrentStep(2);
  };

  // Step 2: Submit Payment -> Trigger add_payment_info
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackAddPaymentInfo(cartItems, grandTotal, formData.paymentType);
    setCurrentStep(3);
  };

  // Step 3: Submit Order -> Trigger purchase
  const handlePlaceOrder = () => {
    const transactionId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const tax = parseFloat((cartTotal * 0.08).toFixed(2));
    const shipping = 5.0;

    trackPurchase(cartItems, grandTotal, transactionId, tax, shipping);

    // Save order data for thank-you page before clearing cart
    const orderSummary = {
      transactionId,
      total: grandTotal,
      itemsCount: cartItems.length,
      customerName: formData.fullName,
      email: formData.email
    };

    sessionStorage.setItem('last_ga4_order', JSON.stringify(orderSummary));
    clearCart();
    navigate(`/thank-you?order_id=${transactionId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Stepper */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Checkout</h1>
        <p className="text-xs text-slate-400">
          GA4 Tracking Sequence: <code className="text-emerald-400 font-mono">begin_checkout</code> (on load) ➔{' '}
          <code className="text-emerald-400 font-mono">add_shipping_info</code> (Step 1) ➔{' '}
          <code className="text-emerald-400 font-mono">add_payment_info</code> (Step 2) ➔{' '}
          <code className="text-emerald-400 font-mono">purchase</code> (Place Order)
        </p>

        {/* Visual Stepper */}
        <div className="flex items-center gap-2 sm:gap-4 mt-6">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              currentStep === 1
                ? 'bg-indigo-600 text-white shadow-md'
                : currentStep > 1
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>1. Shipping Info</span>
            {currentStep > 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>

          <ChevronRight className="w-4 h-4 text-slate-600" />

          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              currentStep === 2
                ? 'bg-indigo-600 text-white shadow-md'
                : currentStep > 2
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>2. Payment Method</span>
            {currentStep > 2 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>

          <ChevronRight className="w-4 h-4 text-slate-600" />

          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              currentStep === 3
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>3. Review & Place Order</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Shipping Info */}
          {currentStep === 1 && (
            <form
              onSubmit={handleShippingSubmit}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-400" /> Step 1: Shipping Information
                </h3>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  Submitting fires add_shipping_info
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Shipping Method</label>
                <select
                  value={formData.shippingTier}
                  onChange={e => setFormData({ ...formData, shippingTier: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Standard Ground ($5.00)">Standard Ground (3-5 Days) - $5.00</option>
                  <option value="Express Priority ($15.00)">Express Priority (1-2 Days) - $15.00</option>
                  <option value="Overnight Air ($25.00)">Overnight Air (Next Day) - $25.00</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {currentStep === 2 && (
            <form
              onSubmit={handlePaymentSubmit}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" /> Step 2: Select Payment Method
                </h3>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  Submitting fires add_payment_info
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Credit Card', 'PayPal', 'Apple Pay'].map(method => (
                  <div
                    key={method}
                    onClick={() => setFormData({ ...formData, paymentType: method })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      formData.paymentType === method
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-indigo-400" />
                    <span className="text-xs font-bold">{method}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Demo Payment Details (Simulated)
                </div>
                <input
                  type="text"
                  readOnly
                  value="4242 •••• •••• 4242"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-400 font-mono rounded-xl px-3.5 py-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Back to Shipping
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Continue to Order Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Review & Place Order */}
          {currentStep === 3 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-indigo-400" /> Step 3: Review & Place Order
                </h3>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-bold">
                  Final Step
                </span>
              </div>

              {/* Order Items Review */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items in Order</h4>
                {cartItems.map(item => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-900"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{item.product.name}</div>
                        <div className="text-[10px] text-slate-400">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-indigo-300">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Payment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block mb-1">Shipping To:</span>
                  <div className="font-semibold text-slate-200">{formData.fullName}</div>
                  <div className="text-slate-400">{formData.address}, {formData.city}, {formData.state} {formData.zip}</div>
                  <div className="text-indigo-400 font-mono mt-1 text-[11px]">{formData.shippingTier}</div>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Payment Method:</span>
                  <div className="font-semibold text-slate-200">{formData.paymentType}</div>
                  <div className="text-slate-400">jane.doe@example.com</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Back to Payment
                </button>

                <button
                  onClick={handlePlaceOrder}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all transform active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Place Order (${grandTotal.toFixed(2)}) & Trigger Purchase Event</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 h-fit sticky top-24 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-3">
            Summary
          </h3>

          <div className="space-y-3 text-xs mb-6">
            <div className="flex justify-between text-slate-300">
              <span>Items Total</span>
              <span className="font-mono text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping</span>
              <span className="font-mono text-white">$5.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax (8%)</span>
              <span className="font-mono text-white">${(cartTotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between text-sm font-extrabold text-white">
              <span>Total Value</span>
              <span className="font-mono text-emerald-400 text-base">
                ${grandTotal.toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Active GA4 Tracking
            </div>
            <p>Every step clears previous ecommerce data before firing event payloads.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
