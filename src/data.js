import { sourceCatalog } from "./sourceCatalog.js";

export { sourceCatalog };

// Categories matched exactly to original p.html sections & filters
export const originalCategories = [
  { name: "All", label: "All Numbers", icon: "✦" },
  { name: "VVIP High End", label: "VVIP High End", icon: "👑" },
  { name: "Most Clicked", label: "Most Clicked", icon: "🔥" },
  { name: "0 Lovers", label: "0 Lovers (Max Zeros)", icon: "0️⃣" },
  { name: "786 Numbers", label: "786 Auspicious", icon: "✨" },
  { name: "Tetra Numbers", label: "Tetra Numbers (XXXX)", icon: "🔢" },
  { name: "Penta Numbers", label: "Penta Numbers", icon: "⭐️" },
  { name: "Mirror Numbers", label: "Mirror Numbers", icon: "🪞" },
  { name: "AB-AB-AB Ending", label: "AB-AB-AB Special", icon: "🔂" },
  { name: "Super Helpline Series", label: "Helpline Series", icon: "📞" },
  { name: "Budget Friendly", label: "Budget Friendly (< ₹5k)", icon: "🏷️" },
  { name: "Lucky Numbers (Root Sum 1)", label: "Root Sum 1", icon: "🎯" }
];

export const quickLinks = [
  {
    id: "lowest-price",
    title: "Lowest Price",
    highlight: "Challenge",
    iconUrl: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic1.svg",
    action: "modal-lowest"
  },
  {
    id: "home-delivery",
    title: "Home",
    highlight: "Delivery",
    iconUrl: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic2.svg",
    action: "modal-delivery"
  },
  {
    id: "pre-post",
    title: "PRE / POST",
    highlight: "Info",
    iconUrl: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic3.svg",
    action: "modal-prepost"
  },
  {
    id: "activation",
    title: "Activation",
    highlight: "Process",
    iconUrl: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic4.svg",
    action: "modal-process"
  },
  {
    id: "share-link",
    title: "Share",
    highlight: "Website",
    iconUrl: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic5.svg",
    action: "share"
  },
  {
    id: "categories",
    title: "Browse All",
    highlight: "Categories",
    iconUrl: "https://www.vipnumbersclub.com/assets/front/img/head-top-ic7.svg",
    action: "scroll-categories"
  }
];

export const originalFaqs = [
  {
    q: "1. What is a VIP mobile number?",
    a: "A VIP mobile number is a specially selected mobile number with a memorable pattern, such as repeating digits, sequences or numerology friendly totals, chosen to stand out from regular numbers."
  },
  {
    q: "2. How do I buy a VIP number from VIP Numbers Club?",
    a: "Simply search or browse our collection, select your preferred number, complete the booking enquiry, and our team will verify availability and send you the Unique Porting Code (UPC) to activate the number in your name."
  },
  {
    q: "3. Can I port a VIP number to any network?",
    a: "Yes, every number provided can be ported to Jio, Airtel, Vi or BSNL, and you can choose either a prepaid or postpaid connection as per your requirement."
  },
  {
    q: "4. How long does the activation process take?",
    a: "Once you receive the UPC code, visit any nearby mobile gallery or authorized store of your preferred operator. Porting normally completes within 3 to 5 business days per standard TRAI porting guidelines."
  },
  {
    q: "5. Is there a Money-Back Guarantee?",
    a: "Yes! VIP Numbers Club provides a 100% Money-Back Guarantee until activation. If there is any unforeseen issue with your UPC generation or transfer, your funds are fully refunded."
  }
];

export const platformFeatures = [
  {
    title: "The India Forbes News",
    articleUrl: "https://www.theindiaforbesnews.co.in/2026/05/vip-numbers-club-defines-excellence.html",
    imgUrl: "https://www.vipnumbersclub.com/uploads/settings/pC2sKXtcN6UtEFtCxil1.png"
  },
  {
    title: "National Media Coverage",
    imgUrl: "https://www.vipnumbersclub.com/uploads/settings/IXQH3jgnS0fm3al5orgN.jfif"
  },
  {
    title: "Press Recognition",
    imgUrl: "https://www.vipnumbersclub.com/uploads/settings/tGGZOA01uL6638WmQ53k.jfif"
  }
];

export const stepsData = [
  {
    step: "01",
    img: "https://www.vipnumbersclub.com/assets/front/img/stp1.svg",
    title: "India’s Biggest Inventory",
    desc: "3,00,000 + VIP Numbers to choose from across all states and operators."
  },
  {
    step: "02",
    img: "https://www.vipnumbersclub.com/assets/front/img/stp2.svg",
    title: "Super Fast UPC Delivery",
    desc: "Direct SMS delivery of Unique Porting Code (UPC) with instant customer support."
  },
  {
    step: "03",
    img: "https://www.vipnumbersclub.com/assets/front/img/stp3.svg",
    title: "Expert Support",
    desc: "Dedicated VIP number specialists to guide you through selection & registration."
  }
];

// Budget Quick Search Filters from p.html "Search By Budget"
export const budgetBands = [
  { label: "Under ₹5,000", min: "", max: "5000" },
  { label: "₹5,000 – ₹15,000", min: "5000", max: "15000" },
  { label: "₹15,000 – ₹50,000", min: "15000", max: "50000" },
  { label: "₹50,000 – ₹1,50,000", min: "50000", max: "150000" },
  { label: "₹1,50,000+ (VVIP)", min: "150000", max: "" }
];
