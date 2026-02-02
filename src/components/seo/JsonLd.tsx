export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GetYouSite Platform',
        url: 'https://getyousite.platform',
        logo: 'https://getyousite.platform/logo.png',
        sameAs: [
            'https://twitter.com/getyousite',
            'https://github.com/getyousite',
            'https://linkedin.com/company/getyousite'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-555-5555',
            contactType: 'Sales',
            areaServed: 'Global',
            availableLanguage: ['English', 'French', 'Spanish']
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
