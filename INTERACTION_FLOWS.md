# VIP Numbers Club Frontend - Interaction Flow & Architecture

## Overview
This React + Vite frontend provides an interactive VIP mobile-number catalogue and enquiry system referencing the original `p.html` source.

---

## Interactive User Flows

### 1. Wishlist (Favourites)
* **Action**: Clicking the heart icon on any number card toggles it in/out of the user's wishlist.
* **Header Button**: Displays the current count of saved wishlist items. Clicking opens the Wishlist review modal.
* **Bulk Actions**: Users can move all items from their wishlist into the Enquiry Cart or clear the wishlist.
* **Persistence**: Persisted across browser sessions using `localStorage.getItem("vip_wishlist")`.

### 2. Enquiry Cart & Review
* **Action**: Clicking **"+ Cart"** adds a number to the enquiry cart.
* **Header Button**: Displays the cart item count.
* **Cart Review Modal**:
  * Shows full breakdown of shortlisted numbers, individual prices, and the total indicative price.
  * Form fields for: **Full Name**, **WhatsApp / Contact Number** (with 10-digit validation), **Preferred Operator** (Jio, Airtel, Vi, BSNL), and **Optional Notes**.
  * Form validation displays clear inline error messages if required fields are missing.
* **Enquiry Message**: Generates a structured enquiry message directly to the verified VIP Numbers Club WhatsApp concierge (`+91 9111117777`).
* **Persistence**: Saved to `localStorage.getItem("vip_cart")`.

### 3. Number Details Modal
* **Action**: Clicking any number's SIM visual or **"Details"** button opens a modal showing:
  * Formatted phone number with highlighted prefix and ending.
  * Numerology digit sum, root total, prefix, and suffix.
  * Current offer price, strike-through original price, and savings percentage.
  * Immediate action to toggle cart or send an instant WhatsApp inquiry for that specific number.

### 4. Custom Number Request Form ("My OWN Choice")
* **Action**: Clicking **"Own Choice Request"** in the navigation, hero banner, or empty-state buttons opens a modal form.
* **Fields**:
  * Name & Phone (with 10-digit validation).
  * Desired Number Pattern / Sequence (e.g., birthdate, anniversary, repeating pairs).
  * Target Budget dropdown (Under ₹10k, ₹10k–₹25k, ₹25k–₹50k, ₹50k–₹1.5L, ₹1.5L+).
  * SIM preference (Prepaid, Postpaid, Either).
  * Additional comments.
* **Submission**: Formats a WhatsApp concierge inquiry to query unlisted nationwide telco inventory.

---

## Honest Frontend Architecture (What Requires a Backend)

Since no backend database or payment gateway API is attached to this static project, the enquiry flow has been built honestly and safely:

1. **No Fake Bookings or Simulated Payment Gateways**: The app never pretends an order is finalized or paid for. It clearly informs users that VIP numbers require live verification with the telco concierge.
2. **Direct Concierge Integration**: Enquiries format structured WhatsApp queries sent to the official verified helpline: `+91 9111117777`.
3. **What Would Require a Dedicated Backend**:
   * Live inventory status synchronization (detecting whether a number was sold in real-time).
   * Direct online payment gateway integration (Razorpay / Cashfree / Stripe).
   * Automatic TRAI Unique Porting Code (UPC) SMS dispatch.
   * Customer account creation, login, and past enquiry tracking.
