// NOTE: Since unsplash-js is not installed, we use a lighter fetch implementation
// to avoid adding heavy dependencies just for this check.

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export interface ImageResult {
    url: string;
    alt: string;
    photographer: string;
    downloadLink?: string;
}

interface UnsplashPhoto {
    urls: { regular: string };
    alt_description: string;
    user: { name: string };
    links: { download_location: string };
}

export async function searchUnsplashImages(
    query: string,
    count: number = 3,
): Promise<ImageResult[]> {
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("⚠️ UNSPLASH_ACCESS_KEY missing. Using placeholders.");
        return getPlaceholders(query, count);
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            },
        );

        if (!response.ok) {
            console.error(`Unsplash API Error: ${response.status}`);
            return getPlaceholders(query, count);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return getPlaceholders(query, count);
        }

        return data.results.map((img: UnsplashPhoto) => ({
            url: img.urls.regular,
            alt: img.alt_description || query,
            photographer: img.user.name,
            downloadLink: img.links.download_location,
        }));
    } catch (error) {
        console.error("Unsplash Fetch Error:", error);
        return getPlaceholders(query, count);
    }
}

function getPlaceholders(query: string, count: number): ImageResult[] {
    // Fallback using a reliable placeholder service if Unsplash fails
    return Array(count)
        .fill(0)
        .map((_, i) => ({
            // Using a highly available placeholder service with the query as text
            url: `https://placehold.co/1200x800/101828/FFF?text=${encodeURIComponent(query)}+${i + 1}`,
            alt: `${query} placeholder`,
            photographer: "System",
        }));
}
