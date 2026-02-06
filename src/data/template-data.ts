export const categories = [
    { id: "all", label: "All" },
    { id: "business", label: "Business & Agency" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "healthcare", label: "Healthcare" },
    { id: "restaurant", label: "Restaurant & Food" },
    { id: "creative", label: "Creative & Portfolio" },
];

export const templates = [
    {
        id: "creative-agency",
        title: "Creative Agency",
        desc: "Modern design for digital agencies and creative studios.",
        category: "business",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
        demoUrl: "/demo/creative-agency",
        badge: "Popular",
        features: ["Portfolio Grid", "Service Pages", "Contact Form"]
    },
    {
        id: "sierra-industry",
        title: "Industrial Pro",
        desc: "Clean and professional design for industrial companies.",
        category: "business",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2432",
        demoUrl: "/demo/sierra-industry",
        badge: null,
        features: ["Contact Forms", "Service Grids", "Client Logos"]
    },
    {
        id: "omega-pro",
        title: "Corporate Elite",
        desc: "Sophisticated architecture for large corporate firms.",
        category: "business",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
        demoUrl: "/demo/omega-pro",
        badge: "PRO",
        features: ["Multi-Path Nav", "Layered Sections", "Premium Typography"]
    },
    {
        id: "cyber-portfolio",
        title: "Creative Portfolio",
        desc: "Minimal and high-contrast design for designers and artists.",
        category: "creative",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2432",
        demoUrl: "/demo/cyber-portfolio",
        badge: "New",
        features: ["Project Gallery", "Case Studies", "Contact Section"]
    },
    {
        id: "dr-khalil",
        title: "Medical Center",
        desc: "Clean clinical aesthetic for doctors and health centers.",
        category: "healthcare",
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
        demoUrl: "/demo/dr-khalil",
        badge: "Recommended",
        features: ["Appointment Booking", "Service List", "Doctor Profiles"]
    },
    {
        id: "vital-care",
        title: "Vital Health",
        desc: "Patient-focused design for hospitals and clinics.",
        category: "healthcare",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "/demo/vital-care",
        badge: "New",
        features: ["Online Booking", "Patient Portal", "Services Overview"]
    },
    {
        id: "luxe-cart",
        title: "Luxe E-Commerce",
        desc: "Premium shopping experience for high-end retail brands.",
        category: "ecommerce",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "/demo/luxe-cart",
        badge: "Best Seller",
        features: ["Product Grid", "Shopping Cart", "Checkout Flow"]
    },
    {
        id: "alpha-pro",
        title: "Alpha Store",
        desc: "Modern retail store with clean layout and fast performance.",
        category: "ecommerce",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "/demo/alpha-pro",
        badge: "PRO",
        features: ["Quick View", "Filter Sidebar", "Optimized Assets"]
    },
    {
        id: "zen-food",
        title: "Modern Restaurant",
        desc: "Appetizing design for restaurants and cafes with online menus.",
        category: "restaurant",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "/demo/zen-food",
        badge: "Popular",
        features: ["Digital Menu", "Table Booking", "Review Section"]
    },
    {
        id: "arch-studio",
        title: "Architecture Studio",
        desc: "Minimalist portfolio for architects and interior designers.",
        category: "creative",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        demoUrl: "/demo/arch-studio",
        badge: "Design Pick",
        features: ["Project Showcase", "About Studio", "Contact Form"]
    }
];

export type Template = {
    id: string;
    title: string;
    desc: string;
    category: string;
    image: string;
    demoUrl: string;
    badge: string | null;
    features: string[];
};
