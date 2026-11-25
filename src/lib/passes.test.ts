import { describe, expect, it } from 'vitest';
import { CORDOBA, distanceKm, NEAR_RADIUS_KM, updatePasses, type Pass } from './passes';

describe('distanceKm', () => {
    it('is zero for the same point', () => {
        expect(distanceKm(CORDOBA.latitude, CORDOBA.longitude, CORDOBA.latitude, CORDOBA.longitude)).toBe(0);
    });
    it('matches a known distance (Córdoba to Buenos Aires is about 650 km)', () => {
        const d = distanceKm(CORDOBA.latitude, CORDOBA.longitude, -34.6037, -58.3816);
        expect(d).toBeGreaterThan(630);
        expect(d).toBeLessThan(670);
    });
});

describe('updatePasses', () => {
    const t = (min: number) => min * 60_000;

    it('ignores positions that are far away', () => {
        expect(updatePasses([], NEAR_RADIUS_KM + 1, t(0))).toEqual([]);
    });

    it('opens a pass, tracks the closest approach and closes it on exit', () => {
        let passes: Pass[] = [];
        passes = updatePasses(passes, 480, t(0));
        passes = updatePasses(passes, 120, t(1));
        passes = updatePasses(passes, 300, t(2));
        expect(passes).toHaveLength(1);
        expect(passes[0]).toMatchObject({ closestKm: 120, closestAt: t(1) });
        expect(passes[0].endedAt).toBeUndefined();

        passes = updatePasses(passes, 900, t(3));
        expect(passes[0].endedAt).toBe(t(2));
        expect(passes).toHaveLength(1);
    });

    it('starts a new pass after the previous one ended', () => {
        let passes = updatePasses([], 100, t(0));
        passes = updatePasses(passes, 900, t(1));
        passes = updatePasses(passes, 200, t(90));
        expect(passes).toHaveLength(2);
        expect(passes[0].startedAt).toBe(t(90));
    });

    it('closes a stale pass left open by a closed tab', () => {
        let passes = updatePasses([], 100, t(0));
        passes = updatePasses(passes, 150, t(30));
        expect(passes).toHaveLength(2);
        expect(passes[1].endedAt).toBe(t(0));
    });
});
