import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingBag, Menu, X, ChevronDown, ArrowUpRight, ShieldCheck,
  Truck, Headset, Heart, SlidersHorizontal, Sparkles, Phone, MessageCircle,
  Plus, CheckCircle2, ChevronRight, Share2, HelpCircle, Flame, Star,
  RotateCcw, Info, Hash, ArrowUpDown, Trash2, Eye, Send, Tag, PhoneCall,
  User, Briefcase, CalendarCheck, Percent, Users, Lock, LogIn
} from "lucide-react";
import {
  sourceCatalog,
  originalCategories,
  quickLinks,
  originalFaqs,
  platformFeatures,
  stepsData,
  budgetBands
} from "./data";
import "./styles.css";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
const formatNumber = (n) => n.replace(/(\d{5})(\d{5})/, "$1 $2");

function App() {
  // Search parameters
  const [search, setSearch] = useState("");
  const [searchPrefix, setSearchPrefix] = useState("");
  const [searchSuffix, setSearchSuffix] = useState("");
  const [searchEnding, setSearchEnding] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Category and filters
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRootSum, setSelectedRootSum] = useState(null);

  // User interactions with LocalStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("vip_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem("vip_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [customRequestOpen, setCustomRequestOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [notice, setNotice] = useState("");

  // Portal Journeys Modals (Auth, Reseller, Pre-Booking)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [resellerModalOpen, setResellerModalOpen] = useState(false);
  const [preBookingModalOpen, setPreBookingModalOpen] = useState(false);

  // Cart Review State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [preferredOperator, setPreferredOperator] = useState("Any / No preference");
  const [cartNotes, setCartNotes] = useState("");
  const [cartValidationErrors, setCartValidationErrors] = useState({});

  // Custom Request Form State
  const [customForm, setCustomForm] = useState({
    name: "",
    phone: "",
    desiredPattern: "",
    budget: "Under ₹10,000",
    simType: "Prepaid",
    comments: ""
  });
  const [customFormErrors, setCustomFormErrors] = useState({});

  // Pre-Booking / Advance Lot Form State
  const [preBookingForm, setPreBookingForm] = useState({
    name: "",
    phone: "",
    lotType: "High Discount Advance Lot",
    notes: ""
  });
  const [preBookingErrors, setPreBookingErrors] = useState({});

  // Reseller Inquiry Form State
  const [resellerForm, setResellerForm] = useState({
    name: "",
    phone: "",
    city: "",
    businessName: "",
    volume: "10-25 numbers/month"
  });
  const [resellerErrors, setResellerErrors] = useState({});

  // Persist cart & favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vip_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("vip_wishlist", JSON.stringify(favourites));
    } catch {}
  }, [favourites]);

  // Verified WhatsApp helpline link generator
  const waLink = (message) =>
    `https://wa.me/919111117777?text=${encodeURIComponent(message)}`;

  // Multi-criteria filtering
  const filteredProducts = useMemo(() => {
    let list = sourceCatalog.filter((p) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.number.includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.ending.includes(query) ||
        p.prefix.includes(query) ||
        p.suffix.includes(query);

      const prefixClean = searchPrefix.trim();
      const matchesPrefix = !prefixClean || p.number.startsWith(prefixClean);

      const suffixClean = searchSuffix.trim();
      const matchesSuffix = !suffixClean || p.number.endsWith(suffixClean);

      const endingClean = searchEnding.trim();
      const matchesEnding = !endingClean || p.number.endsWith(endingClean);

      const matchesCategory = category === "All" || p.category === category;
      const matchesMin = minPrice === "" || p.price >= Number(minPrice);
      const matchesMax = maxPrice === "" || p.price <= Number(maxPrice);
      const matchesRootSum = selectedRootSum === null || p.total === selectedRootSum;

      return (
        matchesSearch &&
        matchesPrefix &&
        matchesSuffix &&
        matchesEnding &&
        matchesCategory &&
        matchesMin &&
        matchesMax &&
        matchesRootSum
      );
    });

    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "discount")
      list = [...list].sort((a, b) => (b.old - b.price) - (a.old - a.price));

    return list;
  }, [
    search,
    searchPrefix,
    searchSuffix,
    searchEnding,
    category,
    sort,
    minPrice,
    maxPrice,
    selectedRootSum
  ]);

  const cartItems = cart
    .map((id) => sourceCatalog.find((p) => p.id === id))
    .filter(Boolean);
  const total = cartItems.reduce((sum, p) => sum + p.price, 0);

  const favItems = favourites
    .map((id) => sourceCatalog.find((p) => p.id === id))
    .filter(Boolean);

  function toggleCart(id) {
    if (cart.includes(id)) {
      setCart((prev) => prev.filter((item) => item !== id));
      triggerToast("Removed from enquiry cart");
    } else {
      setCart((prev) => [...prev, id]);
      triggerToast("Added to enquiry cart");
    }
  }

  function toggleFav(id) {
    if (favourites.includes(id)) {
      setFavourites((prev) => prev.filter((i) => i !== id));
      triggerToast("Removed from wishlist");
    } else {
      setFavourites((prev) => [...prev, id]);
      triggerToast("Added to wishlist");
    }
  }

  function triggerToast(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2800);
  }

  function resetAllFilters() {
    setSearch("");
    setSearchPrefix("");
    setSearchSuffix("");
    setSearchEnding("");
    setCategory("All");
    setSort("featured");
    setMinPrice("");
    setMaxPrice("");
    setSelectedRootSum(null);
    triggerToast("All filters reset");
  }

  // Handle Cart Enquiry Submit
  function handleCartEnquirySubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!customerName.trim()) errors.name = "Please enter your name";
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (Object.keys(errors).length > 0) {
      setCartValidationErrors(errors);
      return;
    }
    setCartValidationErrors({});

    const formattedNumbers = cartItems
      .map((item, idx) => `${idx + 1}. ${item.number} (${money(item.price)}) - ${item.category}`)
      .join("\n");

    const message = [
      `*VIP NUMBERS CLUB - CART ENQUIRY*`,
      `Name: ${customerName.trim()}`,
      `Contact Phone: ${customerPhone.trim()}`,
      `Preferred Network: ${preferredOperator}`,
      cartNotes ? `Notes: ${cartNotes.trim()}` : null,
      `\n*Selected Numbers (${cartItems.length}):*`,
      formattedNumbers,
      `\n*Indicative Total:* ${money(total)}`,
      `\nPlease verify real-time inventory availability and UPC booking procedure.`
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(message), "_blank", "noopener,noreferrer");
    triggerToast("Enquiry message prepared for WhatsApp!");
  }

  // Handle Custom Requirement Submit
  function handleCustomRequestSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!customForm.name.trim()) errors.name = "Please enter your full name";
    if (!customForm.phone.trim() || customForm.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid 10-digit contact number";
    }
    if (!customForm.desiredPattern.trim()) {
      errors.pattern = "Please describe the digit pattern or sequence you want";
    }

    if (Object.keys(errors).length > 0) {
      setCustomFormErrors(errors);
      return;
    }
    setCustomFormErrors({});

    const message = [
      `*VIP NUMBERS CLUB - CUSTOM NUMBER REQUEST*`,
      `Client Name: ${customForm.name.trim()}`,
      `Phone Number: ${customForm.phone.trim()}`,
      `Desired Pattern / Digits: ${customForm.desiredPattern.trim()}`,
      `Budget Range: ${customForm.budget}`,
      `SIM Preference: ${customForm.simType}`,
      customForm.comments ? `Additional Notes: ${customForm.comments.trim()}` : null,
      `\nPlease check national inventory and inform me if matching numbers are available.`
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setCustomRequestOpen(false);
    triggerToast("Custom requirement sent to WhatsApp concierge!");
  }

  // Handle Reseller Form Submit
  function handleResellerSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!resellerForm.name.trim()) errors.name = "Please enter contact name";
    if (!resellerForm.phone.trim() || resellerForm.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Valid 10-digit phone required";
    }
    if (!resellerForm.city.trim()) errors.city = "City / State required";

    if (Object.keys(errors).length > 0) {
      setResellerErrors(errors);
      return;
    }
    setResellerErrors({});

    const message = [
      `*VIP NUMBERS CLUB - RESELLER PANEL APPLICATION*`,
      `Contact Name: ${resellerForm.name.trim()}`,
      `Phone: ${resellerForm.phone.trim()}`,
      `City / State: ${resellerForm.city.trim()}`,
      resellerForm.businessName ? `Shop / Business: ${resellerForm.businessName.trim()}` : null,
      `Estimated Volume: ${resellerForm.volume}`,
      `\nPlease review my reseller panel request and share registration details.`
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setResellerModalOpen(false);
    triggerToast("Reseller application sent via WhatsApp!");
  }

  // Handle Pre-Booking Submit
  function handlePreBookingSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!preBookingForm.name.trim()) errors.name = "Please enter your name";
    if (!preBookingForm.phone.trim() || preBookingForm.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Valid 10-digit contact required";
    }

    if (Object.keys(errors).length > 0) {
      setPreBookingErrors(errors);
      return;
    }
    setPreBookingErrors({});

    const message = [
      `*VIP NUMBERS CLUB - PRE-BOOKING ENQUIRY*`,
      `Client Name: ${preBookingForm.name.trim()}`,
      `Phone: ${preBookingForm.phone.trim()}`,
      `Lot Type: ${preBookingForm.lotType}`,
      preBookingForm.notes ? `Requirement Details: ${preBookingForm.notes.trim()}` : null,
      `\nPlease share the latest advance booking catalog and discounted rates.`
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setPreBookingModalOpen(false);
    triggerToast("Pre-booking inquiry sent via WhatsApp!");
  }

  function handleQuickAction(action) {
    if (action === "modal-lowest") {
      setActiveModal({
        title: "Lowest Price Challenge",
        content:
          "If you find any matching VIP number on any Indian platform or provider at a lower price, VIP Numbers Club commits to beating or matching that price with guaranteed genuine UPC delivery.",
        icon: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic1.svg",
        cta: "Claim Lowest Price Guarantee"
      });
    } else if (action === "modal-delivery") {
      setActiveModal({
        title: "Free Express Home Delivery",
        content:
          "Get your physical SIM or instant digital Unique Porting Code (UPC) delivered safely to your doorstep or straight to your phone anywhere across India.",
        icon: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic2.svg",
        cta: "Enquire Home Delivery"
      });
    } else if (action === "modal-prepost") {
      setActiveModal({
        title: "Prepaid or Postpaid — It's Your Choice",
        content:
          "Every number in our collection can be registered as either a prepaid or postpaid SIM card. Compatible with Jio, Airtel, Vi, and BSNL networks.",
        icon: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic3.svg",
        cta: "Check Operator Porting"
      });
    } else if (action === "modal-process") {
      setActiveModal({
        title: "Official Activation Process",
        content:
          "1. Choose your number.\n2. Receive the Unique Porting Code (UPC) directly on SMS.\n3. Complete verification at your local operator gallery.\n4. Activated in 3 to 5 working days with 100% money-back protection.",
        icon: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic4.svg",
        cta: "Speak with Activation Support"
      });
    } else if (action === "share") {
      if (navigator.share) {
        navigator.share({
          title: "VIP Numbers Club",
          text: "Find premium VIP & fancy numbers in India",
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(window.location.href);
        triggerToast("Website link copied to clipboard!");
      }
    } else if (action === "scroll-categories") {
      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const isFilteringActive =
    Boolean(search) ||
    Boolean(searchPrefix) ||
    Boolean(searchSuffix) ||
    Boolean(searchEnding) ||
    category !== "All" ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    selectedRootSum !== null;

  return (
    <div className="site-shell">
      {/* Accessibility Skip Link */}
      <a href="#catalog-section" className="skip-to-content">
        Skip to main catalogue
      </a>

      {/* Top Utility Notice Bar */}
      <div className="top-notice-bar">
        <div className="notice-inner">
          <div className="notice-left">
            <span className="badge-gold">100% Genuine UPC</span>
            <span>India’s Leading VIP Mobile Number Portal</span>
          </div>
          <div className="notice-right">
            <a href="tel:+919111117777" className="notice-link">
              <Phone size={13} /> +91 9111117777
            </a>
            <a
              href={waLink("Hello VIP Numbers Club, I need consultation.")}
              target="_blank"
              rel="noreferrer"
              className="notice-link"
            >
              <MessageCircle size={13} /> WhatsApp Helpline
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand-link" aria-label="VIP Numbers Club Homepage">
            <img
              src="https://www.vipnumbersclub.com/uploads/settings/Ic5BHdi9XfWg71O19MdZ.png"
              alt="VIP Numbers Club Logo"
              className="brand-logo-img"
              width="42"
              height="42"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="brand-fallback">
              <span className="brand-title">VIP NUMBERS <span>CLUB</span></span>
              <span className="brand-tagline">MAKE IT MEMORABLE</span>
            </div>
          </a>

          <nav
            className={`nav-menu ${menuOpen ? "mobile-active" : ""}`}
            aria-label="Primary navigation"
          >
            <a href="#catalog-section" className="nav-link" onClick={() => setMenuOpen(false)}>
              Browse Numbers
            </a>
            <button
              className="nav-link highlight"
              onClick={() => {
                setCategory("All");
                setMinPrice("");
                setMaxPrice("20000");
                setSort("discount");
                setMenuOpen(false);
                document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                triggerToast("Showing Super High Discounted Deals");
              }}
            >
              <Percent size={14} color="#ff6b35" /> Discounted Deals
            </button>
            <button
              className="nav-link"
              onClick={() => { setPreBookingModalOpen(true); setMenuOpen(false); }}
            >
              <CalendarCheck size={14} /> Pre Booking Lot
            </button>
            <button
              className="nav-link"
              onClick={() => { setResellerModalOpen(true); setMenuOpen(false); }}
            >
              <Briefcase size={14} /> Reseller Panel
            </button>
            <button
              className="nav-link"
              onClick={() => { setCustomRequestOpen(true); setMenuOpen(false); }}
            >
              Own Choice Request
            </button>
            <button
              className="nav-link"
              onClick={() => { setAuthModalOpen(true); setMenuOpen(false); }}
            >
              <User size={14} /> My Account
            </button>
          </nav>

          <div className="header-actions">
            <button
              className="btn-icon"
              aria-label={`Wishlist items (${favourites.length})`}
              onClick={() => setWishlistOpen(true)}
              title="Saved Wishlist"
            >
              <Heart size={18} fill={favourites.length > 0 ? "currentColor" : "none"} color={favourites.length > 0 ? "#ef4444" : "#1e293b"} />
              {favourites.length > 0 && <span className="fav-counter-badge">{favourites.length}</span>}
            </button>
            <button
              className="btn-icon"
              aria-label="Focus search input"
              onClick={() => document.getElementById("hero-search-input")?.focus()}
              title="Search numbers"
            >
              <Search size={18} />
            </button>
            <button
              className="btn-shortlist"
              onClick={() => setCartOpen(true)}
              aria-label={`View enquiry cart with ${cart.length} numbers`}
            >
              <ShoppingBag size={16} />
              <span>Cart</span>
              <span className="cart-counter">{cart.length}</span>
            </button>
            <button
              className="btn-icon mobile-toggle"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Quick Promo Strip */}
      <section className="quick-promo-strip" aria-label="Promotional highlights">
        <div className="quick-promo-inner">
          {quickLinks.map((item) => (
            <button
              key={item.id}
              className="quick-promo-card"
              onClick={() => handleQuickAction(item.action)}
              aria-label={`${item.title} ${item.highlight}`}
            >
              <img
                src={item.iconUrl}
                alt=""
                width="22"
                height="22"
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>{item.title}</strong> <span>{item.highlight}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <main id="home">
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-tag">
                <Sparkles size={14} /> 100% Money-Back Guarantee Until Activation
              </div>
              <h1 className="hero-title">
                Buy VIP &amp; Fancy Mobile<br />
                <em>Numbers Online in India</em>
              </h1>
              <p className="hero-desc">
                Search verified digit sequences from <code>p.html</code>. Shortlist numbers, inspect full details, or submit a custom request for any unique sequence.
              </p>

              {/* Instant Search Bar */}
              <div className="hero-search-wrapper">
                <div className="hero-search-row">
                  <div className="search-input-box">
                    <Search size={18} color="#94a3b8" />
                    <input
                      id="hero-search-input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search digits (e.g. 786, 000, 7777, 911)..."
                      aria-label="Search VIP numbers by digits"
                    />
                  </div>
                  <button
                    className="btn-hero-search"
                    onClick={() => {
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Search Catalog <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="hero-quick-tags">
                  <span>Quick patterns:</span>
                  {["786", "0000", "7777", "1111", "9999", "8888"].map((pat) => (
                    <button
                      key={pat}
                      className="quick-tag-btn"
                      onClick={() => {
                        setSearch(pat);
                        document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {pat}
                    </button>
                  ))}
                  <button
                    className="quick-tag-btn"
                    style={{ background: "rgba(212, 175, 55, 0.25)" }}
                    onClick={() => {
                      setShowAdvancedSearch(!showAdvancedSearch);
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    aria-expanded={showAdvancedSearch}
                  >
                    <SlidersHorizontal size={12} /> {showAdvancedSearch ? "Hide Advanced Search" : "Advanced Pattern Search"}
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Showcase Card */}
            <div className="hero-showcase">
              <div className="hero-card-featured">
                <div className="card-featured-top">
                  <span className="card-featured-badge">VVIP HIGH END</span>
                  <div className="card-timer-badge">
                    <Star size={13} color="#d4af37" /> Top Reference Pick
                  </div>
                </div>
                <div className="hero-number-display">
                  7777 <span>877730</span>
                </div>
                <div className="card-featured-meta">
                  <span>Sum: 60</span>
                  <span>Root: 6</span>
                  <span>MNP Ready</span>
                </div>
                <div className="card-featured-price">
                  <span className="card-price-current">{money(56000)}</span>
                  <span className="card-price-original">{money(70000)}</span>
                  <span className="price-saving">20% OFF</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
                  <button
                    className="modal-btn-secondary"
                    onClick={() => setDetailProduct(sourceCatalog[4])}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-card-enquire"
                    style={{ margin: 0 }}
                    onClick={() =>
                      window.open(
                        waLink("Hello VIP Numbers Club, I want to check availability for VVIP number 7777877730."),
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges Strip */}
        <section className="trust-metrics-strip" aria-label="Customer protections">
          <div className="trust-metrics-inner">
            <div className="metric-box">
              <div className="metric-icon"><ShieldCheck size={22} /></div>
              <div className="metric-text">
                <h3>Money-Back Guarantee</h3>
                <p>100% protected until activation</p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon"><Sparkles size={22} /></div>
              <div className="metric-text">
                <h3>3,00,000+ Inventory Claim</h3>
                <p>Curated from official p.html source</p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon"><Truck size={22} /></div>
              <div className="metric-text">
                <h3>Fast UPC Delivery</h3>
                <p>Direct SMS code for quick porting</p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon"><Headset size={22} /></div>
              <div className="metric-text">
                <h3>Prepaid &amp; Postpaid</h3>
                <p>Jio, Airtel, Vi, and BSNL ready</p>
              </div>
            </div>
          </div>
        </section>

        {/* "My OWN Choice Number" Banner */}
        <div className="section-wrapper" style={{ paddingBottom: 0 }}>
          <div className="own-choice-banner">
            <div className="own-choice-inner">
              <div className="own-choice-content">
                <h2>My OWN <span>Choice Number</span></h2>
                <p>
                  Looking for a custom birthdate pattern, anniversary, lucky numerology sum, or matching couple pack?
                  Submit your custom requirement directly to our team.
                </p>
              </div>
              <button className="btn-own-choice" onClick={() => setCustomRequestOpen(true)}>
                Submit Custom Request <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Section with Advanced Search and Filters */}
        <section className="section-wrapper" id="catalog-section">
          <div className="section-header-row">
            <div className="section-heading-group">
              <h2>VIP Numbers Catalogue ({filteredProducts.length} Results)</h2>
              <p>Explore verified patterns extracted from the original website markup</p>
            </div>
            <button
              className="toggle-advanced-btn"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              aria-expanded={showAdvancedSearch}
            >
              <SlidersHorizontal size={15} />
              {showAdvancedSearch ? "Hide Advanced Search" : "Advanced Pattern Search"}
            </button>
          </div>

          {/* Quick Search By Budget Band (from p.html) */}
          <div className="budget-band-wrapper" role="group" aria-label="Quick search by budget">
            <span className="budget-band-title">
              <Tag size={15} color="#d4af37" /> Search By Budget:
            </span>
            {budgetBands.map((band) => {
              const isSelected = minPrice === band.min && maxPrice === band.max;
              return (
                <button
                  key={band.label}
                  className={`budget-pill ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setMinPrice("");
                      setMaxPrice("");
                    } else {
                      setMinPrice(band.min);
                      setMaxPrice(band.max);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  {band.label}
                </button>
              );
            })}
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="advanced-search-card">
              <div className="advanced-search-header">
                <h3><Hash size={16} /> Targeted Pattern Search</h3>
                <span className="advanced-search-hint">Filter by specific starting digits, ending sequences, or suffixes</span>
              </div>
              <div className="advanced-search-grid">
                <div className="pattern-input-group">
                  <label htmlFor="prefix-input">Starts With (Prefix)</label>
                  <input
                    id="prefix-input"
                    type="text"
                    maxLength={5}
                    placeholder="e.g. 777, 911, 859"
                    value={searchPrefix}
                    onChange={(e) => setSearchPrefix(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="pattern-input-group">
                  <label htmlFor="suffix-input">Ends With (Suffix)</label>
                  <input
                    id="suffix-input"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 0000, 786, 1111"
                    value={searchSuffix}
                    onChange={(e) => setSearchSuffix(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="pattern-input-group">
                  <label htmlFor="ending-input">Last 4 Digits</label>
                  <input
                    id="ending-input"
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 6786, 7730, 2399"
                    value={searchEnding}
                    onChange={(e) => setSearchEnding(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="pattern-input-group action-group">
                  <label>&nbsp;</label>
                  <button
                    className="btn-clear-pattern"
                    onClick={() => {
                      setSearchPrefix("");
                      setSearchSuffix("");
                      setSearchEnding("");
                    }}
                  >
                    Clear Pattern
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category Pills Scroll */}
          <div className="category-pills-scroll" role="tablist" aria-label="Catalog Categories">
            {originalCategories.map((cat) => (
              <button
                key={cat.name}
                className={`category-pill ${category === cat.name ? "active" : ""}`}
                onClick={() => setCategory(cat.name)}
                role="tab"
                aria-selected={category === cat.name}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Numerology Total Filter Bar */}
          <div className="numerology-bar" style={{ marginTop: "1rem" }} role="group" aria-label="Numerology root sum selector">
            <span className="numerology-title">
              <Sparkles size={16} color="#d4af37" /> Lucky Root Sum:
            </span>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sum) => (
              <button
                key={sum}
                className={`root-num-btn ${selectedRootSum === sum ? "active" : ""}`}
                onClick={() => setSelectedRootSum(selectedRootSum === sum ? null : sum)}
                aria-pressed={selectedRootSum === sum}
              >
                Total {sum}
              </button>
            ))}
            {selectedRootSum !== null && (
              <button
                className="root-num-btn"
                style={{ color: "#ef4444" }}
                onClick={() => setSelectedRootSum(null)}
              >
                Clear Total
              </button>
            )}
          </div>

          {/* Filtering and Search Toolbar */}
          <div className="catalog-toolbar">
            <div className="catalog-search-field">
              <Search size={16} color="#64748b" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complete number or digit sequence..."
                aria-label="Filter catalogue by number or ending"
              />
              {search && (
                <button
                  className="clear-icon-btn"
                  onClick={() => setSearch("")}
                  aria-label="Clear search text"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="catalog-filter-controls">
              <div className="control-with-icon">
                <ArrowUpDown size={14} className="control-icon" />
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                  <option value="featured">Sort by: Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="discount">Highest Savings</option>
                </select>
              </div>

              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                aria-label="Minimum Price Filter"
              >
                <option value="">Min Price</option>
                <option value="5000">Min ₹5,000</option>
                <option value="15000">Min ₹15,000</option>
                <option value="50000">Min ₹50,000</option>
                <option value="100000">Min ₹1,00,000</option>
              </select>

              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                aria-label="Maximum Price Filter"
              >
                <option value="">Max Price</option>
                <option value="10000">Up to ₹10,000</option>
                <option value="25000">Up to ₹25,000</option>
                <option value="50000">Up to ₹50,000</option>
                <option value="150000">Up to ₹1,50,000</option>
                <option value="500000">Up to ₹5,00,000</option>
              </select>

              {isFilteringActive && (
                <button className="reset-filters-btn" onClick={resetAllFilters}>
                  <RotateCcw size={13} /> Reset All
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {isFilteringActive && (
            <div className="active-chips-strip">
              <span className="chips-label">Active filters:</span>
              {search && (
                <span className="filter-chip">
                  Search: "{search}" <X size={12} onClick={() => setSearch("")} aria-label="Remove search filter" />
                </span>
              )}
              {searchPrefix && (
                <span className="filter-chip">
                  Starts with: "{searchPrefix}" <X size={12} onClick={() => setSearchPrefix("")} aria-label="Remove prefix filter" />
                </span>
              )}
              {searchSuffix && (
                <span className="filter-chip">
                  Ends with: "{searchSuffix}" <X size={12} onClick={() => setSearchSuffix("")} aria-label="Remove suffix filter" />
                </span>
              )}
              {searchEnding && (
                <span className="filter-chip">
                  Last 4: "{searchEnding}" <X size={12} onClick={() => setSearchEnding("")} aria-label="Remove ending filter" />
                </span>
              )}
              {category !== "All" && (
                <span className="filter-chip">
                  Category: {category} <X size={12} onClick={() => setCategory("All")} aria-label="Remove category filter" />
                </span>
              )}
              {selectedRootSum !== null && (
                <span className="filter-chip">
                  Root Sum: {selectedRootSum} <X size={12} onClick={() => setSelectedRootSum(null)} aria-label="Remove root sum filter" />
                </span>
              )}
              {minPrice && (
                <span className="filter-chip">
                  Min: {money(minPrice)} <X size={12} onClick={() => setMinPrice("")} aria-label="Remove min price filter" />
                </span>
              )}
              {maxPrice && (
                <span className="filter-chip">
                  Max: {money(maxPrice)} <X size={12} onClick={() => setMaxPrice("")} aria-label="Remove max price filter" />
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          <div className="products-grid">
            {filteredProducts.map((p) => {
              const isFav = favourites.includes(p.id);
              const inCart = cart.includes(p.id);
              return (
                <article className="product-card" key={p.id}>
                  <div className="card-header-status">
                    <span className="tag-category-badge">{p.category}</span>
                    <button
                      className={`btn-fav ${isFav ? "active" : ""}`}
                      onClick={() => toggleFav(p.id)}
                      aria-label={isFav ? `Remove ${p.number} from wishlist` : `Add ${p.number} to wishlist`}
                      title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div
                    className="card-sim-display"
                    onClick={() => setDetailProduct(p)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDetailProduct(p);
                      }
                    }}
                    aria-label={`View details for number ${p.number}`}
                  >
                    <div className="card-sim-pattern">
                      {formatNumber(p.number)}
                    </div>
                    <div className="card-sim-network">
                      <span>Prefix: {p.prefix}</span>
                      <span>Ending: {p.ending}</span>
                    </div>
                  </div>

                  <div className="card-meta-row">
                    <span>Sum: <strong>{p.sum}</strong></span>
                    <span>Root: <strong>{p.total}</strong></span>
                    <span>4-Ending: <strong>{p.ending}</strong></span>
                  </div>

                  <div className="card-pricing-block">
                    <div>
                      <span className="price-final">{money(p.price)}</span>
                      {p.old > p.price && (
                        <span className="price-strike">{money(p.old)}</span>
                      )}
                    </div>
                    {p.old > p.price && (
                      <span className="price-saving">
                        {Math.round((1 - p.price / p.old) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="card-source-tag">
                    <span className="badge-source-ref">Reference Catalog</span>
                    <button
                      className="btn-view-details-inline"
                      onClick={() => setDetailProduct(p)}
                      aria-label={`Inspect full specifications for ${p.number}`}
                    >
                      <Eye size={13} /> Details
                    </button>
                  </div>

                  <div className="card-action-buttons">
                    <button
                      className="btn-card-shortlist"
                      onClick={() => toggleCart(p.id)}
                      aria-label={inCart ? `Remove ${p.number} from cart` : `Add ${p.number} to cart`}
                    >
                      {inCart ? <CheckCircle2 size={14} color="#10b981" /> : <Plus size={14} />}
                      {inCart ? "In Cart" : "+ Cart"}
                    </button>
                    <button
                      className="btn-card-buy"
                      onClick={() =>
                        window.open(
                          waLink(
                            `Hello VIP Numbers Club, I want to check current availability for reference number ${p.number} listed at ${money(
                              p.price
                            )} (${p.category}).`
                          ),
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      aria-label={`Enquire about number ${p.number} on WhatsApp`}
                    >
                      <MessageCircle size={14} /> Enquire
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* No Results Fallback */}
          {filteredProducts.length === 0 && (
            <div className="no-results-box" role="status">
              <HelpCircle size={44} color="#94a3b8" />
              <h3>No numbers match your current filters</h3>
              <p>
                We couldn't find any numbers matching your criteria. Try adjusting your prefix, suffix,
                or price range, or submit a custom request.
              </p>
              <div className="no-results-actions">
                <button className="btn-reset-large" onClick={resetAllFilters}>
                  <RotateCcw size={16} /> Reset All Filters
                </button>
                <button className="btn-custom-inquiry" onClick={() => setCustomRequestOpen(true)}>
                  Request Custom Number
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Featured On Platforms Strip */}
        <section className="press-platforms-section" aria-label="Media mentions">
          <h2>VIP Portal Featured On Top Platforms</h2>
          <div className="press-logos-row">
            {platformFeatures.map((item, idx) => (
              <a
                key={idx}
                href={item.articleUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="press-logo-card"
                title={item.title}
              >
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  width="160"
                  height="48"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </a>
            ))}
          </div>
        </section>

        {/* Activation Process Section */}
        <section className="process-section" id="process-section">
          <div className="section-wrapper" style={{ padding: 0 }}>
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
              <div className="hero-tag">
                <CheckCircle2 size={14} /> Simple 3-Step MNP Process
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                How to Activate Your VIP Number
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Activating your chosen VIP number is seamless and complies with standard Indian telecom regulations.
              </p>
            </div>

            <div className="process-steps-grid">
              {stepsData.map((step) => (
                <div className="process-card" key={step.step}>
                  <div className="process-card-step">STEP {step.step}</div>
                  <div className="process-card-img">
                    <img
                      src={step.img}
                      alt={step.title}
                      width="64"
                      height="64"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="section-wrapper" id="faq-section">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
            <div className="hero-tag">
              <HelpCircle size={14} /> Frequently Asked Questions
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-navy)" }}>
              Clear Answers to Common Questions
            </h2>
          </div>

          <div className="faq-container">
            {originalFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div className="faq-item" key={index}>
                  <button
                    className="faq-question"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease"
                      }}
                    />
                  </button>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer" id="footer-section">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>VIP NUMBERS CLUB</h3>
              <p>
                India's trusted VIP mobile number portal offering 3,00,000+ fancy, rare, and numerology-aligned
                mobile numbers with 100% money-back guarantee until activation.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <small style={{ color: "#94a3b8" }}>GSTIN: 08IKIPS0640Q1ZD</small>
              </div>
            </div>

            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul className="footer-links-list">
                <li><a href="#catalog-section" onClick={() => setCategory("VVIP High End")}>VVIP High End Numbers</a></li>
                <li><a href="#catalog-section" onClick={() => setCategory("786 Numbers")}>786 Lucky Numbers</a></li>
                <li><a href="#catalog-section" onClick={() => setCategory("0 Lovers")}>0 Lovers &amp; Tetra</a></li>
                <li><button type="button" onClick={() => setPreBookingModalOpen(true)}>Advance Pre-Booking</button></li>
                <li><button type="button" onClick={() => setResellerModalOpen(true)}>Reseller Program</button></li>
                <li><a href="#process-section">Porting &amp; Activation</a></li>
                <li><a href="#faq-section">Help &amp; FAQs</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>By Network</h3>
              <ul className="footer-links-list">
                <li><button type="button" onClick={() => handleQuickAction("modal-prepost")}>Jio Fancy Numbers</button></li>
                <li><button type="button" onClick={() => handleQuickAction("modal-prepost")}>Airtel VIP Numbers</button></li>
                <li><button type="button" onClick={() => handleQuickAction("modal-prepost")}>Vodafone Idea (Vi) Numbers</button></li>
                <li><button type="button" onClick={() => handleQuickAction("modal-prepost")}>BSNL VIP Numbers</button></li>
                <li><button type="button" onClick={() => handleQuickAction("modal-prepost")}>Prepaid &amp; Postpaid Options</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Registered Office</h3>
              <p>
                601, 6th Floor, The Elysian,<br />
                Swej Farm Circle, Civil Lines,<br />
                Jaipur, Rajasthan — 302019
              </p>
              <div style={{ marginTop: "1rem" }}>
                <p>Phone: <a href="tel:+919111117777" style={{ color: "var(--gold)" }}>+91 9111117777</a></p>
                <p>Email: <a href="mailto:info@vipnumbersclub.com" style={{ color: "var(--gold)" }}>info@vipnumbersclub.com</a></p>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>&copy; {new Date().getFullYear()} VIP Numbers Club. All rights reserved.</span>
            <span>Prepaid or Postpaid — It's Your Choice | Reference Catalog</span>
            <a href="#home" style={{ color: "#cbd5e1", textDecoration: "none" }}>Back to Top &uarr;</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        className="floating-whatsapp-btn"
        href={waLink("Hello VIP Numbers Club, I want assistance with choosing a VIP number.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Direct WhatsApp Consultation"
      >
        <MessageCircle size={20} />
        <span>Need Help?</span>
      </a>

      {/* 1. NUMBER DETAILS MODAL */}
      {detailProduct && (
        <div className="modal-overlay" onClick={() => setDetailProduct(null)} role="dialog" aria-modal="true" aria-labelledby="modal-detail-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setDetailProduct(null)} aria-label="Close details modal">
              <X size={16} />
            </button>

            <div className="detail-sim-card">
              <span className="tag-category-badge" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                {detailProduct.category}
              </span>
              <div className="detail-number-heading" id="modal-detail-title">
                {formatNumber(detailProduct.number)}
              </div>
              <div className="detail-sim-tag">
                Universal MNP (Jio • Airtel • Vi • BSNL)
              </div>
            </div>

            <div className="detail-specs-grid">
              <div className="spec-box">
                <small>Numerology Sum</small>
                <strong>{detailProduct.sum}</strong>
              </div>
              <div className="spec-box">
                <small>Single Root Total</small>
                <strong>{detailProduct.total} (Lucky Total)</strong>
              </div>
              <div className="spec-box">
                <small>Prefix Sequence</small>
                <strong>{detailProduct.prefix}</strong>
              </div>
              <div className="spec-box">
                <small>Suffix Ending</small>
                <strong>{detailProduct.ending}</strong>
              </div>
            </div>

            <div className="detail-price-box">
              <div>
                <small style={{ color: "#854d0e", fontWeight: 600 }}>Listed Offer Price</small>
                <div className="price-current">{money(detailProduct.price)}</div>
              </div>
              {detailProduct.old > detailProduct.price && (
                <div style={{ textAlign: "right" }}>
                  <small style={{ textDecoration: "line-through", color: "#a16207" }}>
                    {money(detailProduct.old)}
                  </small>
                  <div style={{ color: "#15803d", fontWeight: 700, fontSize: "0.85rem" }}>
                    Save {Math.round((1 - detailProduct.price / detailProduct.old) * 100)}%
                  </div>
                </div>
              )}
            </div>

            <div className="backend-notice-box">
              <Info size={14} style={{ display: "inline", marginRight: "4px" }} />
              <strong>Genuine Reservation Flow:</strong> This triggers an inquiry message to our VIP booking concierge on WhatsApp to verify current live availability and initiate the TRAI MNP code.
            </div>

            <div className="detail-actions-row">
              <button
                className="modal-btn-secondary"
                onClick={() => {
                  toggleCart(detailProduct.id);
                }}
              >
                {cart.includes(detailProduct.id) ? "Remove from Cart" : "+ Add to Cart"}
              </button>
              <button
                className="modal-btn-confirm"
                onClick={() =>
                  window.open(
                    waLink(
                      `Hello VIP Numbers Club, I want to check availability and book VIP number ${detailProduct.number} (${money(
                        detailProduct.price
                      )}, Category: ${detailProduct.category}, Sum: ${detailProduct.sum}).`
                    ),
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <MessageCircle size={16} /> Enquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. WISHLIST MODAL */}
      {wishlistOpen && (
        <div className="modal-overlay" onClick={() => setWishlistOpen(false)} role="dialog" aria-modal="true" aria-labelledby="modal-wishlist-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setWishlistOpen(false)} aria-label="Close wishlist modal">
              <X size={16} />
            </button>
            <h3 id="modal-wishlist-title">Saved Wishlist ({favourites.length})</h3>
            <p>Saved to your local browser for easy comparison.</p>

            {favItems.length > 0 ? (
              <>
                <div style={{ maxHeight: "260px", overflowY: "auto", margin: "1rem 0" }}>
                  {favItems.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.6rem 0",
                        borderBottom: "1px solid #e2e8f0"
                      }}
                    >
                      <div>
                        <strong>{formatNumber(p.number)}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {p.category} | Sum {p.sum} | Root {p.total}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{money(p.price)}</span>
                        <button
                          style={{
                            background: "#f1f5f9",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                          onClick={() => toggleCart(p.id)}
                          aria-label={cart.includes(p.id) ? "Number is in cart" : `Add ${p.number} to cart`}
                        >
                          {cart.includes(p.id) ? "In Cart" : "+ Cart"}
                        </button>
                        <button
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                          onClick={() => toggleFav(p.id)}
                          title="Remove from wishlist"
                          aria-label={`Remove ${p.number} from wishlist`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-actions" style={{ marginTop: "1rem" }}>
                  <button
                    className="modal-btn-confirm"
                    onClick={() => {
                      const newIds = favItems.map(f => f.id);
                      setCart(prev => [...new Set([...prev, ...newIds])]);
                      triggerToast("All wishlist items moved to cart!");
                    }}
                  >
                    Move All to Enquiry Cart
                  </button>
                  <button
                    className="modal-btn-secondary"
                    onClick={() => {
                      setFavourites([]);
                      triggerToast("Wishlist cleared");
                    }}
                  >
                    Clear Wishlist
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <Heart size={36} color="#cbd5e1" style={{ margin: "0 auto 0.5rem" }} />
                <p>Your wishlist is empty. Tap the heart icon on any card to save numbers here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ENQUIRY CART REVIEW MODAL */}
      {cartOpen && (
        <div className="modal-overlay" onClick={() => setCartOpen(false)} role="dialog" aria-modal="true" aria-labelledby="modal-cart-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart review modal">
              <X size={16} />
            </button>
            <h3 id="modal-cart-title">Enquiry Cart ({cart.length})</h3>
            <p>Review your selected numbers and submit an official availability check.</p>

            {cartItems.length > 0 ? (
              <form onSubmit={handleCartEnquirySubmit}>
                <div style={{ maxHeight: "200px", overflowY: "auto", margin: "1rem 0" }}>
                  {cartItems.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #e2e8f0"
                      }}
                    >
                      <div>
                        <strong>{formatNumber(p.number)}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {p.category} | Sum {p.sum} | Root {p.total}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontWeight: 700 }}>{money(p.price)}</span>
                        <button
                          type="button"
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                          onClick={() => toggleCart(p.id)}
                          title="Remove from cart"
                          aria-label={`Remove ${p.number} from cart`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-review-summary">
                  <div className="cart-review-row">
                    <span>Selected Items:</span>
                    <strong>{cartItems.length} number(s)</strong>
                  </div>
                  <div className="cart-review-row total-row">
                    <span>Total Indicative Price:</span>
                    <span>{money(total)}</span>
                  </div>
                </div>

                <div className="custom-form-group">
                  <label htmlFor="cart-name">Your Full Name <span>*</span></label>
                  <input
                    id="cart-name"
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {cartValidationErrors.name && (
                    <div className="form-error">{cartValidationErrors.name}</div>
                  )}
                </div>

                <div className="custom-form-group">
                  <label htmlFor="cart-phone">WhatsApp / Contact Number <span>*</span></label>
                  <input
                    id="cart-phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  {cartValidationErrors.phone && (
                    <div className="form-error">{cartValidationErrors.phone}</div>
                  )}
                </div>

                <div className="custom-form-group">
                  <label htmlFor="cart-operator">Preferred Network Port</label>
                  <select
                    id="cart-operator"
                    value={preferredOperator}
                    onChange={(e) => setPreferredOperator(e.target.value)}
                  >
                    <option>Any / No preference</option>
                    <option>Jio (Prepaid / Postpaid)</option>
                    <option>Airtel (Prepaid / Postpaid)</option>
                    <option>Vodafone Idea (Vi)</option>
                    <option>BSNL</option>
                  </select>
                </div>

                <div className="custom-form-group">
                  <label htmlFor="cart-notes">Special Instructions (Optional)</label>
                  <input
                    id="cart-notes"
                    type="text"
                    placeholder="e.g. need fast delivery, urgent activation"
                    value={cartNotes}
                    onChange={(e) => setCartNotes(e.target.value)}
                  />
                </div>

                <div className="backend-notice-box">
                  <Info size={14} style={{ display: "inline", marginRight: "4px" }} />
                  <strong>Direct Concierge Submission:</strong> Submitting formats a verified inquiry message for our official WhatsApp helpline (<code>+91 9111117777</code>) to check live reservation status.
                </div>

                <div className="modal-actions">
                  <button type="submit" className="modal-btn-confirm">
                    <Send size={15} /> Send Cart Enquiry via WhatsApp
                  </button>
                  <button
                    type="button"
                    className="modal-btn-secondary"
                    onClick={() => {
                      setCart([]);
                      triggerToast("Cart cleared");
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <ShoppingBag size={36} color="#cbd5e1" style={{ margin: "0 auto 0.5rem" }} />
                <p>Your cart is empty. Click "+ Cart" on any number card to add items here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CUSTOM NUMBER REQUEST FORM MODAL */}
      {customRequestOpen && (
        <div className="modal-overlay" onClick={() => setCustomRequestOpen(false)} role="dialog" aria-modal="true" aria-labelledby="modal-custom-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCustomRequestOpen(false)} aria-label="Close custom request modal">
              <X size={16} />
            </button>
            <h3 id="modal-custom-title">My OWN Choice Number Request</h3>
            <p>Tell us the specific digits, birth year, or custom sequence you need.</p>

            <form onSubmit={handleCustomRequestSubmit}>
              <div className="custom-form-group">
                <label htmlFor="req-name">Your Full Name <span>*</span></label>
                <input
                  id="req-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                />
                {customFormErrors.name && (
                  <div className="form-error">{customFormErrors.name}</div>
                )}
              </div>

              <div className="custom-form-group">
                <label htmlFor="req-phone">Your Mobile Number <span>*</span></label>
                <input
                  id="req-phone"
                  type="tel"
                  placeholder="e.g. 9811112222"
                  value={customForm.phone}
                  onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                />
                {customFormErrors.phone && (
                  <div className="form-error">{customFormErrors.phone}</div>
                )}
              </div>

              <div className="custom-form-group">
                <label htmlFor="req-pattern">Desired Number Pattern / Sequence <span>*</span></label>
                <input
                  id="req-pattern"
                  type="text"
                  placeholder="e.g. ending 1995, 00000X, 786-786, ABAB pattern"
                  value={customForm.desiredPattern}
                  onChange={(e) => setCustomForm({ ...customForm, desiredPattern: e.target.value })}
                />
                {customFormErrors.pattern && (
                  <div className="form-error">{customFormErrors.pattern}</div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="custom-form-group">
                  <label htmlFor="req-budget">Budget Target</label>
                  <select
                    id="req-budget"
                    value={customForm.budget}
                    onChange={(e) => setCustomForm({ ...customForm, budget: e.target.value })}
                  >
                    <option>Under ₹10,000</option>
                    <option>₹10,000 – ₹25,000</option>
                    <option>₹25,000 – ₹50,000</option>
                    <option>₹50,000 – ₹1,50,000</option>
                    <option>₹1,50,000+ (High End VVIP)</option>
                  </select>
                </div>

                <div className="custom-form-group">
                  <label htmlFor="req-type">SIM Type</label>
                  <select
                    id="req-type"
                    value={customForm.simType}
                    onChange={(e) => setCustomForm({ ...customForm, simType: e.target.value })}
                  >
                    <option>Prepaid</option>
                    <option>Postpaid</option>
                    <option>Either</option>
                  </select>
                </div>
              </div>

              <div className="custom-form-group">
                <label htmlFor="req-comments">Additional Preferences (Optional)</label>
                <textarea
                  id="req-comments"
                  rows={2}
                  placeholder="Any operator preference, family pack requirement, or total root sum..."
                  value={customForm.comments}
                  onChange={(e) => setCustomForm({ ...customForm, comments: e.target.value })}
                />
              </div>

              <div className="backend-notice-box">
                <Info size={14} style={{ display: "inline", marginRight: "4px" }} />
                Submitting opens WhatsApp with your pre-filled inquiry addressed directly to our inventory manager. No credentials or online payments are asked.
              </div>

              <div className="modal-actions">
                <button type="submit" className="modal-btn-confirm">
                  <Send size={15} /> Send Custom Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. USER ACCOUNT & AUTH JOURNEY MODAL */}
      {authModalOpen && (
        <div className="modal-overlay" onClick={() => setAuthModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="modal-auth-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setAuthModalOpen(false)} aria-label="Close account modal">
              <X size={16} />
            </button>
            <div className="modal-icon-header">
              <Lock size={26} color="#d4af37" />
            </div>
            <h3 id="modal-auth-title">My Account &amp; Order Portal</h3>
            <p>Access your booked numbers, invoice copies, and UPC status.</p>

            <div className="backend-notice-box" style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}>
              <Info size={14} style={{ display: "inline", marginRight: "4px" }} />
              <strong>Backend Account Dependency:</strong> Customer login requires authentication and session tokens connected to the live database. To check your booking status or request past invoice copies, please contact our support desk directly with your booked mobile number.
            </div>

            <div className="custom-form-group">
              <label htmlFor="login-phone">Registered Mobile Number</label>
              <input id="login-phone" type="tel" placeholder="e.g. 9111117777" />
            </div>

            <div className="modal-actions" style={{ flexDirection: "column" }}>
              <button
                type="button"
                className="modal-btn-confirm"
                onClick={() => {
                  window.open(
                    waLink("Hello VIP Numbers Club, I want to check my account booking status and active UPC orders."),
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                <MessageCircle size={16} /> Contact Account Support on WhatsApp
              </button>
              <button
                type="button"
                className="modal-btn-secondary"
                onClick={() => setAuthModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. RESELLER PANEL MODAL */}
      {resellerModalOpen && (
        <div className="modal-overlay" onClick={() => setResellerModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="modal-reseller-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setResellerModalOpen(false)} aria-label="Close reseller modal">
              <X size={16} />
            </button>
            <div className="modal-icon-header">
              <Briefcase size={26} color="#d4af37" />
            </div>
            <h3 id="modal-reseller-title">VIP Numbers Reseller Partner Panel</h3>
            <p>Partner with VIP Numbers Club to sell fancy and VIP numbers in your city.</p>

            <form onSubmit={handleResellerSubmit}>
              <div className="custom-form-group">
                <label htmlFor="res-name">Contact Person Name <span>*</span></label>
                <input
                  id="res-name"
                  type="text"
                  placeholder="e.g. Amit Kumar"
                  value={resellerForm.name}
                  onChange={(e) => setResellerForm({ ...resellerForm, name: e.target.value })}
                />
                {resellerErrors.name && <div className="form-error">{resellerErrors.name}</div>}
              </div>

              <div className="custom-form-group">
                <label htmlFor="res-phone">Mobile / WhatsApp Number <span>*</span></label>
                <input
                  id="res-phone"
                  type="tel"
                  placeholder="e.g. 9812345678"
                  value={resellerForm.phone}
                  onChange={(e) => setResellerForm({ ...resellerForm, phone: e.target.value })}
                />
                {resellerErrors.phone && <div className="form-error">{resellerErrors.phone}</div>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="custom-form-group">
                  <label htmlFor="res-city">City / State <span>*</span></label>
                  <input
                    id="res-city"
                    type="text"
                    placeholder="e.g. Mumbai, MH"
                    value={resellerForm.city}
                    onChange={(e) => setResellerForm({ ...resellerForm, city: e.target.value })}
                  />
                  {resellerErrors.city && <div className="form-error">{resellerErrors.city}</div>}
                </div>

                <div className="custom-form-group">
                  <label htmlFor="res-biz">Shop / Business Name</label>
                  <input
                    id="res-biz"
                    type="text"
                    placeholder="e.g. Telecom Hub"
                    value={resellerForm.businessName}
                    onChange={(e) => setResellerForm({ ...resellerForm, businessName: e.target.value })}
                  />
                </div>
              </div>

              <div className="custom-form-group">
                <label htmlFor="res-vol">Expected Monthly Volume</label>
                <select
                  id="res-vol"
                  value={resellerForm.volume}
                  onChange={(e) => setResellerForm({ ...resellerForm, volume: e.target.value })}
                >
                  <option>10-25 numbers/month</option>
                  <option>25-50 numbers/month</option>
                  <option>50+ numbers/month (Bulk Partner)</option>
                </select>
              </div>

              <div className="backend-notice-box">
                <Info size={14} style={{ display: "inline", marginRight: "4px" }} />
                Submitting this form connects you directly with our B2B wholesale manager with wholesale catalog rate access.
              </div>

              <div className="modal-actions">
                <button type="submit" className="modal-btn-confirm">
                  <Send size={15} /> Apply for Reseller Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. PRE-BOOKING & ADVANCE LOT MODAL */}
      {preBookingModalOpen && (
        <div className="modal-overlay" onClick={() => setPreBookingModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="modal-prebook-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setPreBookingModalOpen(false)} aria-label="Close prebooking modal">
              <X size={16} />
            </button>
            <div className="modal-icon-header">
              <CalendarCheck size={26} color="#d4af37" />
            </div>
            <h3 id="modal-prebook-title">Advance Pre-Booking Lot</h3>
            <p>Lock upcoming telecom number releases at high discount pre-launch rates.</p>

            <form onSubmit={handlePreBookingSubmit}>
              <div className="custom-form-group">
                <label htmlFor="pre-name">Your Full Name <span>*</span></label>
                <input
                  id="pre-name"
                  type="text"
                  placeholder="e.g. Rajesh Mehra"
                  value={preBookingForm.name}
                  onChange={(e) => setPreBookingForm({ ...preBookingForm, name: e.target.value })}
                />
                {preBookingErrors.name && <div className="form-error">{preBookingErrors.name}</div>}
              </div>

              <div className="custom-form-group">
                <label htmlFor="pre-phone">Contact Number <span>*</span></label>
                <input
                  id="pre-phone"
                  type="tel"
                  placeholder="e.g. 9811112222"
                  value={preBookingForm.phone}
                  onChange={(e) => setPreBookingForm({ ...preBookingForm, phone: e.target.value })}
                />
                {preBookingErrors.phone && <div className="form-error">{preBookingErrors.phone}</div>}
              </div>

              <div className="custom-form-group">
                <label htmlFor="pre-lot">Advance Lot Category</label>
                <select
                  id="pre-lot"
                  value={preBookingForm.lotType}
                  onChange={(e) => setPreBookingForm({ ...preBookingForm, lotType: e.target.value })}
                >
                  <option>High Discount Advance Lot</option>
                  <option>Upcoming Hexa / Penta Series</option>
                  <option>Corporate Batch Pre-Booking (10+ SIMs)</option>
                  <option>Auspicious 786 Release Lot</option>
                </select>
              </div>

              <div className="custom-form-group">
                <label htmlFor="pre-notes">Preferred Pattern / Specifications</label>
                <textarea
                  id="pre-notes"
                  rows={2}
                  placeholder="Specify any operator, preferred state circle, or digit pattern..."
                  value={preBookingForm.notes}
                  onChange={(e) => setPreBookingForm({ ...preBookingForm, notes: e.target.value })}
                />
              </div>

              <div className="backend-notice-box">
                <Info size={14} style={{ display: "inline", marginRight: "4px" }} />
                Advance pre-booking guarantees first right of refusal when new batches arrive from telcos before public listing.
              </div>

              <div className="modal-actions">
                <button type="submit" className="modal-btn-confirm">
                  <Send size={15} /> Request Advance Lot Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. POLICY & INFORMATION MODAL */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)} role="dialog" aria-modal="true" aria-labelledby="modal-info-title">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModal(null)} aria-label="Close information dialog">
              <X size={16} />
            </button>
            {activeModal.icon && (
              <div className="modal-icon-header">
                <img src={activeModal.icon} alt="" width="32" height="32" />
              </div>
            )}
            <h3 id="modal-info-title">{activeModal.title}</h3>
            <p style={{ whiteSpace: "pre-line", textAlign: "left" }}>{activeModal.content}</p>
            <div className="modal-actions">
              <button
                className="modal-btn-confirm"
                onClick={() =>
                  window.open(
                    waLink(`Hello VIP Numbers Club, I am enquiring regarding: ${activeModal.title}`),
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <MessageCircle size={16} /> {activeModal.cta}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            background: "#0f1c2e",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            zIndex: 1000,
            border: "1px solid rgba(212,175,55,0.4)"
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          {notice}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
