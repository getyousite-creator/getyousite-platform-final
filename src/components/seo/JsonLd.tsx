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
        '@type': 'WebApplication',
        name: name,
        url: url,
        image: logo,
        description: description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        inLanguage: locale,
        offers: {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        author: {
            '@type': 'Organization',
            'name': 'GYS Global Sovereign'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+212-000-000000',
            contactType: 'customer service',
            areaServed: 'Global',
            availableLanguage: ['Arabic', 'English', 'French', 'Spanish', 'German', 'Italian', 'Russian']
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
