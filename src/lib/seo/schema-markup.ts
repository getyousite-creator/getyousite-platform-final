type GenericRecord = Record<string, unknown>;

interface StoreLike {
    id: string;
    name: string;
    slug?: string | null;
    template_id?: string | null;
    custom_domain?: string | null;
    blueprint?: unknown;
    seo_title?: string | null;
    seo_description?: string | null;
}

interface SchemaInput {
    hostname: string;
    store: StoreLike;
}

function safeString(value: unknown, fallback = ""): string {
    const text = String(value ?? "").trim();
    return text || fallback;
}

function inferBusinessType(signal: string) {
    if (/(restaurant|cafe|food|مطعم)/.test(signal)) return "Restaurant";
    if (/(clinic|medical|dental|doctor|عيادة|طبيب)/.test(signal)) return "MedicalBusiness";
    if (/(law|legal|attorney|محام|قانون)/.test(signal)) return "LegalService";
    if (/(store|shop|retail|ecommerce|متجر)/.test(signal)) return "Store";
    return "ProfessionalService";
}

function extractFaqEntities(blueprint: GenericRecord, url: string) {
    const layout = Array.isArray(blueprint.layout) ? blueprint.layout : [];
    const questions: Array<{
        "@type": "Question";
        name: string;
        acceptedAnswer: { "@type": "Answer"; text: string };
    }> = [];

    for (const item of layout) {
        const section = item as GenericRecord;
        const sectionType = safeString(section.type).toLowerCase();
        if (!["faq", "faq_master"].includes(sectionType)) continue;

        const content = (section.content || {}) as GenericRecord;
        const candidates = [
            ...(Array.isArray(content.items) ? content.items : []),
            ...(Array.isArray(content.faqs) ? content.faqs : []),
            ...(Array.isArray(content.questions) ? content.questions : []),
        ];

        for (const candidate of candidates) {
            const row = candidate as GenericRecord;
            const question = safeString(row.question || row.q);
            const answer = safeString(row.answer || row.a);
            if (!question || !answer) continue;
            questions.push({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
            });
        }
    }

    if (!questions.length) return null;
    return {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: questions.slice(0, 10),
    };
}

export function buildSiteSchemaGraph({ hostname, store }: SchemaInput) {
    const blueprint = ((store.blueprint as GenericRecord) || {}) as GenericRecord;
    const metadata = (blueprint.metadata || {}) as GenericRecord;
    const seo = (metadata.seo || {}) as GenericRecord;

    const siteUrl = `https://${hostname}`;
    const name = safeString(store.name, "GetYouSite");
    const title = safeString(seo.title || store.seo_title, name);
    const description = safeString(
        seo.description || store.seo_description || blueprint.description,
        `${name} official website`,
    );
    const nicheSignal =
        `${safeString(metadata.niche)} ${safeString(store.template_id)}`.toLowerCase();
    const businessType = inferBusinessType(nicheSignal);

    const website = {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name,
        inLanguage: "ar,en",
        potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    const organization = {
        "@type": "Organization",
        "@id": `${siteUrl}#org`,
        url: siteUrl,
        name,
        description,
        sameAs: [],
        brand: {
            "@type": "Brand",
            name: title,
        },
    };

    const localBusiness = {
        "@type": businessType,
        "@id": `${siteUrl}#business`,
        name,
        url: siteUrl,
        description,
    };

    const graph: GenericRecord[] = [website, organization, localBusiness];
    const faqSchema = extractFaqEntities(blueprint, siteUrl);
    if (faqSchema) graph.push(faqSchema);

    return graph;
}

export function serializeSchemaGraph(graph: GenericRecord[]) {
    return JSON.stringify(
        {
            "@context": "https://schema.org",
            "@graph": graph,
        },
        null,
        0,
    ).replace(/</g, "\\u003c");
}
