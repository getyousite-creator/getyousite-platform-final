interface JsonLdProps {
    name: string;
    url: string;
    description: string;
    logo: string;
    locale: string;
}

export default function JsonLd({ name, url, description, logo, locale }: JsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: name,
        url: url,
        logo: logo,
        description: description,
        inLanguage: locale,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Casablanca',
            addressCountry: 'MA'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+212-000-000000',
            contactType: 'customer service',
            areaServed: 'Global',
            availableLanguage: ['Arabic', 'English', 'French', 'Spanish']
        },
        sameAs: [
            'https://twitter.com/getyousite',
            'https://linkedin.com/company/getyousite',
            'https://facebook.com/getyousite'
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
