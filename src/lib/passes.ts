export const CORDOBA = { name: 'Córdoba, Argentina', latitude: -31.4201, longitude: -64.1888 };
export const NEAR_RADIUS_KM = 500;
/** If the page was closed for longer than this, an open pass is considered finished. */
const STALE_MS = 2 * 60 * 1000;
const MAX_PASSES = 100;

export interface Pass {
    id: number;
    startedAt: number;
    lastSeenAt: number;
    /** Set once the station left the radius. */
    endedAt?: number;
    closestKm: number;
    closestAt: number;
}

const EARTH_RADIUS_KM = 6371;

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const rad = (d: number) => (d * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Newest first. Pure so it can be tested without a browser. */
export function updatePasses(passes: Pass[], distance: number, at: number): Pass[] {
    let current = passes[0];

    if (current && current.endedAt === undefined && at - current.lastSeenAt > STALE_MS) {
        current = { ...current, endedAt: current.lastSeenAt };
        passes = [current, ...passes.slice(1)];
    }

    const open = current && current.endedAt === undefined ? current : undefined;

    if (distance <= NEAR_RADIUS_KM) {
        if (open) {
            const closer = distance < open.closestKm;
            const next: Pass = {
                ...open,
                lastSeenAt: at,
                closestKm: closer ? distance : open.closestKm,
                closestAt: closer ? at : open.closestAt
            };
            return [next, ...passes.slice(1)];
        }
        const created: Pass = { id: at, startedAt: at, lastSeenAt: at, closestKm: distance, closestAt: at };
        return [created, ...passes].slice(0, MAX_PASSES);
    }

    if (open) return [{ ...open, endedAt: open.lastSeenAt }, ...passes.slice(1)];
    return passes;
}
