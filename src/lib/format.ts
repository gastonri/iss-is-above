import { LOCALES, type Lang } from './i18n';

export function formatCoordinate(value: number, axis: 'lat' | 'lon', lang: Lang = 'en'): string {
    const west = lang === 'es' ? 'O' : 'W';
    const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : west;
    return `${Math.abs(value).toFixed(3)}° ${hemisphere}`;
}

export function formatNumber(value: number, digits = 0, lang: Lang = 'en'): string {
    return value.toLocaleString(LOCALES[lang], { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

/**
 * The map wraps horizontally, so a naive trail would draw a line across the whole
 * world every time the ISS crosses the antimeridian. Split it into segments instead.
 */
export function splitAtAntimeridian(points: [number, number][]): [number, number][][] {
    const segments: [number, number][][] = [];
    let current: [number, number][] = [];
    for (const point of points) {
        const previous = current[current.length - 1];
        if (previous && Math.abs(point[1] - previous[1]) > 180) {
            segments.push(current);
            current = [];
        }
        current.push(point);
    }
    if (current.length) segments.push(current);
    return segments;
}
