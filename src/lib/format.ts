export function formatCoordinate(value: number, axis: 'lat' | 'lon'): string {
    const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
    return `${Math.abs(value).toFixed(3)}° ${hemisphere}`;
}

export function formatNumber(value: number, digits = 0): string {
    return value.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function visibilityLabel(visibility: string): string {
    switch (visibility) {
        case 'daylight':
            return 'In daylight';
        case 'visible':
            return 'Visible from the ground';
        default:
            return 'In Earth’s shadow';
    }
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
