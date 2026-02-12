interface JsonLdProps {
    name?: string;
    url?: string;
    description?: string;
    logo?: string;
}

export default function JsonLd({ name, url, description, logo }: JsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: name || 'GetYouSite Sovereign Node',
        url: url || 'https://getyousite.com',
        description: description || 'Professional AI-Orchestrated digital empire.',
        logo: logo || 'https://getyousite.com/logo.png',
        areaServed: 'Global',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
