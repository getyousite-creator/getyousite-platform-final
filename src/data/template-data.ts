export const categories = [
    { id: "all", label: "All Architectures" },
    { id: "business", label: "Business & Agency" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "healthcare", label: "Healthcare" },
    { id: "restaurant", label: "Restaurant & Food" },
    { id: "creative", label: "Creative & Portfolio" },
    { id: "education", label: "Education" },
    { id: "realestate", label: "Real Estate" },
    { id: "legal", label: "Legal & Corporate" },
    { id: "fintech", label: "Fintech & SaaS" },
    { id: "hospitality", label: "Hospitality & Travel" },
];

export const templates = [
    // Agency / Business
    {
        id: "creative-agency",
        title: "NeuraAgency Flagship",
        desc: "Neural-inspired dark mode architecture with fluid sequences and AI-first layouts.",
        category: "business",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
        demoUrl: "https://demo-agency.getyousite.com",
        badge: "Flagship",
        features: ["Deep Animations", "GSAP Physics", "Dynamic Theming"]
    },
    {
        id: "sierra-industry",
        title: "Sierra Industrial",
        desc: "Trust-centric corporate architecture for industrial and manufacturing empires.",
        category: "business",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2432",
        demoUrl: "https://demo-industrial.getyousite.com",
        badge: null,
        features: ["Contact Forms", "Service Grids", "Client Logos"]
    },
    {
        id: "omega-pro",
        title: "OmegaAgency Pro",
        desc: "Ultra-High Fidelity agency architecture transcribed from Astra Pro. Best for big corporate firms.",
        category: "business",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
        demoUrl: "https://demo-omega.getyousite.com",
        badge: "PRO EDITION",
        features: ["Multi-Path Nav", "Layer Orchestration", "Hyper-Typography"]
    },
    // Creative / Portfolio (Innovation Phase)
    {
        id: "cyber-portfolio",
        title: "CyberPortfolio V2",
        desc: "A brutalist, high-contrast creative engine with glitch transitions and 3D depth.",
        category: "creative",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2432",
        demoUrl: "https://demo-cyber.getyousite.com",
        badge: "New Innovation",
        features: ["Glitch Transitions", "3D Content Parallax", "Force Interactions"]
    },
    // Healthcare
    {
        id: "vital-care",
        title: "VitalCare Health",
        desc: "Clinical, clean, and patient-focused architecture for medical centers and clinics.",
        category: "healthcare",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-health.getyousite.com",
        badge: "Essential",
        features: ["Booking Engine", "Patient Portal", "HIPAA Ready"]
    },
    // E-Commerce
    {
        id: "luxe-cart",
        title: "LuxeCart Pro",
        desc: "High-end retail experience with fast checkouts and premium product showcases.",
        category: "ecommerce",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-luxe.getyousite.com",
        badge: "Revenue First",
        features: ["Cart AI", "Inventory Sync", "Ultra-Checkout"]
    },
    {
        id: "alpha-pro",
        title: "AlphaStore Pro",
        desc: "Intelligent retail engine transcribed from Divi patterns. Features high-converting product grids.",
        category: "ecommerce",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-alpha.getyousite.com",
        badge: "PRO EDITION",
        features: ["Floating Carts", "Sensory Grids", "Ultra-Light Assets"]
    },
    // Legal
    {
        id: "law-silo",
        title: "LawSilo Elite",
        desc: "Sophisticated, authoritative design for legal practices and corporate law firms.",
        category: "legal",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-legal.getyousite.com",
        badge: "Professional",
        features: ["Case Search", "Client Intake", "Secure Dossier"]
    },
    // SaaS / Fintech (New Innovation)
    {
        id: "tech-grid",
        title: "TechGrid SaaS",
        desc: "A hyper-modern grid architecture for software metrics and financial dashboards.",
        category: "fintech",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-saas.getyousite.com",
        badge: "Beta",
        features: ["Metric Visualizers", "API Doc Layouts", "Dark/Light Auto"]
    },
    // Education
    {
        id: "elite-lms",
        title: "EliteLMS Quantum",
        desc: "Modern e-learning platform architecture with course tracking and community hubs.",
        category: "education",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-lms.getyousite.com",
        badge: "LMS",
        features: ["Course Builder", "Progress Sync", "Interactive Quiz"]
    },
    // Real Estate
    {
        id: "boreal-estate",
        title: "Boreal Estates",
        desc: "Immersive real estate architecture with map integrations and virtual tour readiness.",
        category: "realestate",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-estate.getyousite.com",
        badge: null,
        features: ["MLS Integration", "Map Search", "Video Tours"]
    },
    // Restaurant
    {
        id: "zen-food",
        title: "Zen Kitchen Pro",
        desc: "Sensory-focused restaurant architecture with visual menus and reservation logic.",
        category: "restaurant",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-food.getyousite.com",
        badge: "Refined",
        features: ["Menu Sync", "Table Booking", "Review Grid"]
    },
    // Hospitality (New Innovation)
    {
        id: "verma-hospitality",
        title: "Verma Luxury",
        desc: "Ultra-high-end hospitality architecture for boutique hotels and private resorts.",
        category: "hospitality",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2430",
        demoUrl: "https://demo-hotel.getyousite.com",
        badge: "Elite",
        features: ["Concierge Connect", "Amenity Showcase", "Direct Booking"]
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
