# GTM & GA4 E-Commerce Tracking Demo Website

A lightweight, high-performance E-commerce demo website built specifically for testing **Google Tag Manager (GTM)** container snippets and **Google Analytics 4 (GA4)** e-commerce `dataLayer` events.

All data is mocked client-side with zero backend dependencies, making it instant to run locally or deploy to **Vercel / Netlify**.

---

## 🚀 How to Swap in your Real GTM Container ID

The application is configured with your live Container ID **`GTM-KB5PV3ZB`**.

### Step-by-Step Replacement:
Open [index.html](file:///d:/Dat-Work/mercatus-ai/gtm-ga4-ecommerce-demo/index.html) in your editor and replace `GTM-XXXXXXX` with your actual GTM Container ID in **two places**:

1. **In the `<head>` tag** (around line 4):
   ```html
   <!-- Google Tag Manager -->
   <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
   })(window,document,'script','dataLayer','YOUR_REAL_GTM_ID');</script>
   <!-- End Google Tag Manager -->
   ```

2. **Right after the opening `<body>` tag** (around line 34):
   ```html
   <!-- Google Tag Manager (noscript) -->
   <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=YOUR_REAL_GTM_ID"
   height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
   <!-- End Google Tag Manager (noscript) -->
   ```

---

## 📊 Full List of Implemented GA4 DataLayer Events

Every event call automatically executes `window.dataLayer.push({ ecommerce: null });` beforehand to **prevent GA4 data bleeding across user actions**.

| Event Name | Trigger Point | Location / Route | Key Payload Attributes |
| :--- | :--- | :--- | :--- |
| **`view_item_list`** | Page Mount | Listing (`/`) | `item_list_id`, `item_list_name`, `items[]` |
| **`select_item`** | Product Card Click | Listing (`/`) or Related Widget (`/product/:id`) | `item_list_id`, `item_list_name`, `items[]` (with 1-based `index`) |
| **`view_item`** | Page Mount | Product Detail (`/product/:id`) | `currency`, `value`, `items[]` |
| **`add_to_cart`** | "Add to Cart" Button Click | Detail (`/product/:id`) or Card | `currency`, `value`, `items[]` |
| **`remove_from_cart`**| Remove / Quantity 0 Click | Cart (`/cart`) | `currency`, `value`, `items[]` |
| **`view_cart`** | Page Mount (runs ONCE regardless of cart length) | Cart (`/cart`) | `currency`, `value`, `items[]` |
| **`begin_checkout`** | Page Mount | Checkout (`/checkout`) | `currency`, `value`, `items[]` |
| **`add_shipping_info`**| Step 1 Submit ("Continue to Payment") | Checkout (`/checkout`) | `currency`, `value`, `shipping_tier`, `items[]` |
| **`add_payment_info`** | Step 2 Submit ("Continue to Order Review") | Checkout (`/checkout`) | `currency`, `value`, `payment_type`, `items[]` |
| **`purchase`** | "Place Order" Button Click | Checkout (`/checkout`) ➔ `/thank-you` | `transaction_id`, `value`, `tax`, `shipping`, `currency: "USD"`, `items[]` |

---

## 🔍 On-Screen & Console Debugging Tools

### 1. Floating Debug Inspector
Click the **"GTM DataLayer Inspector"** pill floating in the bottom-right corner of any page. It displays:
- Real-time timeline of all `dataLayer.push` calls.
- Full expandable JSON payloads for every event.
- One-click copy JSON feature.

### 2. Instant DevTools Console Logging
Click **"Console.log"** inside the Floating Inspector (or call `window.dataLayer` directly in Chrome/Edge DevTools):
```js
console.log(window.dataLayer);
```
Outputs a formatted table of all recorded events and objects.

---

## ⚡ GTM Interceptor SDK Integration

This demo application is integrated with the [`gtm-interceptor-sdk`](file:///d:/Dat-Work/mercatus-ai/gtm-interceptor-sdk) for testing and proof-of-concept verification.

### 1. Integration Method
- **Method in Use**: **Static IIFE script tag** injected in [`index.html`](file:///d:/Dat-Work/mercatus-ai/gtm-ga4-ecommerce-demo/index.html) immediately **before** the Google Tag Manager snippet.
- **Why Before GTM?**: Loading the interceptor prior to the GTM container ensures that the SDK wraps `window.dataLayer.push` before any tags fire. This guarantees that even the earliest lifecycle events (such as `gtm.start` and `gtm.js`) are intercepted, normalized, and chained downstream without event loss.
- **Single Integration Path**: All secondary/ESM imports have been removed from `src/main.tsx` so that there is a single, unambiguous integration path with zero duplicate event logging.

### 2. Bundle Origin & Build Workflow
The client-side bundle is located at:
```
gtm-ga4-ecommerce-demo/public/gtm-interceptor.iife.js
```
- **Source**: Built directly from `gtm-interceptor-sdk`.
- **Rebuilding after SDK changes**:
  ```bash
  # 1. In gtm-interceptor-sdk directory:
  cd ../gtm-interceptor-sdk
  npm run build:iife

  # 2. Copy the fresh bundle to this repo's public directory:
  cp dist/gtm-interceptor.iife.js ../gtm-ga4-ecommerce-demo/public/gtm-interceptor.iife.js
  ```
  *(Note: This copy step is currently manual, so ensure you rebuild and re-copy the bundle whenever you modify SDK source code).*

### 3. Consent Mode Testing Helpers
Because this demo application does not include a third-party CMP (cookie banner), test helpers are exposed on `window` and wired to interactive buttons in the **DataLayer Inspector** drawer:
- **`window.simulateConsentDenial()`** (or click **"🔒 Deny Consent"** in the Inspector):
  Pushes `gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' })`. Subsequent e-commerce events (like `add_to_cart`) are gated and buffered into a local FIFO queue with status `[QUEUED]`.
- **`window.simulateConsentGrant()`** (or click **"🔓 Grant Consent"** in the Inspector):
  Pushes `gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })`. Gated events are automatically drained in FIFO order and dispatched with status `[FLUSHED]`.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm or yarn

### Commands
```bash
# 1. Navigate into project directory
cd gtm-ga4-ecommerce-demo

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production (optional)
npm run build
```

Open your browser at `http://localhost:3000` to test the application.

---

## 🌐 Deploying to Vercel / Netlify

- **Vercel**: Run `npx vercel` in the project root.
- **Netlify**: Run `npx netlify deploy` or drag-and-drop the `dist` build folder.
