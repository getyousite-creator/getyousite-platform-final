const TEMPLATE_FEATURE_KEY_MAP: Record<string, string> = {
    "Smart Booking": "smartBooking",
    "Service blueprints": "serviceBlueprints",
    "Clinical Gallery": "clinicalGallery",
    "High-Conv Funnels": "highConvFunnels",
    "Glass Cart": "glassCart",
    "One-Click Checkout": "oneClickCheckout",
    "Trust Grids": "trustGrids",
    "Global Operations": "globalOperations",
    "Investor Portals": "investorPortals",
    "Program Matrices": "programMatrices",
    "Trainer Profiles": "trainerProfiles",
    "Progress Tracking": "progressTracking",
    "Automated Ledger": "automatedLedger",
    "Tax Compliance": "taxCompliance",
    "Invoicing Engine": "invoicingEngine",
    "CRM Logic": "crmLogic",
    "Inventory Matrices": "inventoryMatrices",
    "System Logs": "systemLogs",
    "Case Management": "caseManagement",
    "Partner Profiles": "partnerProfiles",
    "Secure Intake": "secureIntake",
    "Dynamic Menus": "dynamicMenus",
    "Reservation Engine": "reservationEngine",
    "Critics Section": "criticsSection",
    "Masonry Grid": "masonryGrid",
    "Cinematic Reels": "cinematicReels",
    "Vision Matrices": "visionMatrices",
    "Data Visuals": "dataVisuals",
    "Feature Grids": "featureGrids",
    "Lead Discovery": "leadDiscovery",
    "Property Search": "propertySearch",
    "Market Intel": "marketIntel",
    "Virtual Tours": "virtualTours",
    "Course Matrix": "courseMatrix",
    "Learning Paths": "learningPaths",
    "Curriculum Grid": "curriculumGrid",
    "News Grid": "newsGrid",
    "Reader Focus": "readerFocus",
    "Article Matrix": "articleMatrix",
    "Therapy Menu": "therapyMenu",
    "Soft Visuals": "softVisuals",
    "Calm Booking": "calmBooking",
    "Quick Look": "quickLook",
    "Size Guide": "sizeGuide",
    "Street Vibes": "streetVibes",
    "Attorney Profiles": "attorneyProfiles",
    "Practice Areas": "practiceAreas",
    Consultation: "consultation",
    "Seasonal Menu": "seasonalMenu",
    "Chef's Table": "chefsTable",
    "Event Booking": "eventBooking",
    "Portfolio Grid": "portfolioGrid",
    "Investment Thesis": "investmentThesis",
    "Team Focus": "teamFocus",
    "Smile Gallery": "smileGallery",
    "Patient Forms": "patientForms",
    "Emergency Info": "emergencyInfo",
    "Class Schedule": "classSchedule",
    "Instructor Bio": "instructorBio",
    "New Student Offer": "newStudentOffer",
    "Tech Stack": "techStack",
    "Case Studies": "caseStudies",
    "Integration API": "integrationApi",
    "Neighborhood Guide": "neighborhoodGuide",
    "Buying Guide": "buyingGuide",
    "Mortgage Calc": "mortgageCalc",
    "Breaking News": "breakingNews",
    "Trending Topics": "trendingTopics",
    Newsletter: "newsletter",
    "Skill Track": "skillTrack",
    Certification: "certification",
    "Team Access": "teamAccess",
};

type Translator = {
    (key: string): string;
    has?: (key: string) => boolean;
};

export function getTemplateFeatureLabel(t: Translator, feature: string): string {
    const key = TEMPLATE_FEATURE_KEY_MAP[feature];
    if (!key) return feature;

    const translationKey = `Templates.features.${key}`;

    if (typeof t.has === "function" && t.has(translationKey)) {
        return t(translationKey);
    }

    try {
        const translated = t(translationKey);
        if (
            translated === translationKey ||
            translated === `Showcase.${translationKey}` ||
            translated.endsWith(`.${translationKey}`)
        ) {
            return feature;
        }
        return translated;
    } catch {
        return feature;
    }
}
