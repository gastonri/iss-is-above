export interface IssPosition {
    latitude: number;
    longitude: number;
    /** Kilometres above sea level. */
    altitude: number;
    /** Kilometres per hour. */
    velocity: number;
    visibility: 'daylight' | 'visible' | 'eclipsed';
    /** Unix seconds. */
    timestamp: number;
}

export interface Place {
    /** Main label, e.g. "Santiago de Chile" or "Pacific Ocean". */
    name: string;
    /** Secondary label, e.g. the country. */
    detail?: string;
    /** Names to try, in order, when looking for a photo. */
    photoQueries: string[];
}

export interface Photo {
    title: string;
    extract: string;
    imageUrl: string;
    pageUrl: string;
}
