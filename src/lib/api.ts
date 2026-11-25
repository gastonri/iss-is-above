import type { IssPosition, Photo, Place } from './types';

const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const WIKI_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    return response.json() as Promise<T>;
}

export async function fetchIssPosition(signal?: AbortSignal): Promise<IssPosition> {
    return getJson<IssPosition>(ISS_URL, signal);
}

interface GeocodeResponse {
    city?: string;
    locality?: string;
    principalSubdivision?: string;
    countryName?: string;
    localityInfo?: { informative?: { name: string }[] };
}

/** Turns raw reverse-geocoding output into something a human can read. Exported for tests. */
export function toPlace(data: GeocodeResponse): Place {
    const country = data.countryName || undefined;
    const ocean = data.localityInfo?.informative?.find((i) => /ocean|sea|gulf|bay|strait/i.test(i.name))?.name;
    const local = data.city || data.locality || undefined;

    const name = local ?? ocean ?? country ?? 'Open ocean';
    const detail = local ? country : ocean && ocean !== name ? ocean : undefined;
    const photoQueries = [local, data.principalSubdivision, country, ocean].filter(
        (q): q is string => Boolean(q)
    );

    return { name, detail, photoQueries: [...new Set(photoQueries)] };
}

export async function fetchPlace(latitude: number, longitude: number, signal?: AbortSignal): Promise<Place> {
    const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        localityLanguage: 'en'
    });
    try {
        return toPlace(await getJson<GeocodeResponse>(`${GEOCODE_URL}?${params}`, signal));
    } catch (error) {
        if (signal?.aborted) throw error;
        return { name: 'Open ocean', photoQueries: [] };
    }
}

interface WikiSummary {
    title: string;
    extract: string;
    thumbnail?: { source: string };
    originalimage?: { source: string };
    content_urls?: { desktop?: { page: string } };
    type?: string;
}

/** Tries each query until one has a Wikipedia article with a picture. */
export async function fetchPhoto(queries: string[], signal?: AbortSignal): Promise<Photo | null> {
    for (const query of queries) {
        try {
            const data = await getJson<WikiSummary>(`${WIKI_URL}/${encodeURIComponent(query)}`, signal);
            const imageUrl = data.originalimage?.source ?? data.thumbnail?.source;
            if (data.type === 'standard' && imageUrl) {
                return {
                    title: data.title,
                    extract: data.extract,
                    imageUrl: data.thumbnail?.source ?? imageUrl,
                    pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
                };
            }
        } catch (error) {
            if (signal?.aborted) throw error;
        }
    }
    return null;
}
