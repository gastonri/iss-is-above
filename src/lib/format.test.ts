import { describe, expect, it } from 'vitest';
import { toPlace } from './api';
import { formatCoordinate, splitAtAntimeridian } from './format';

describe('formatCoordinate', () => {
    it('adds hemisphere letters', () => {
        expect(formatCoordinate(-33.4567, 'lat')).toBe('33.457° S');
        expect(formatCoordinate(-70.6, 'lon')).toBe('70.600° W');
        expect(formatCoordinate(12, 'lon')).toBe('12.000° E');
    });
    it('uses O for west in Spanish', () => {
        expect(formatCoordinate(-70.6, 'lon', 'es')).toBe('70.600° O');
    });
});

describe('splitAtAntimeridian', () => {
    it('keeps continuous trails in one segment', () => {
        expect(splitAtAntimeridian([[0, 10], [1, 20]])).toHaveLength(1);
    });
    it('breaks the line when longitude wraps', () => {
        const segments = splitAtAntimeridian([[0, 170], [1, 179], [2, -178], [3, -170]]);
        expect(segments).toEqual([[[0, 170], [1, 179]], [[2, -178], [3, -170]]]);
    });
});

describe('toPlace', () => {
    it('prefers the city and shows the country as detail', () => {
        const place = toPlace({ city: 'Santiago', countryName: 'Chile', principalSubdivision: 'RM' });
        expect(place).toMatchObject({ name: 'Santiago', detail: 'Chile' });
        expect(place.photoQueries).toEqual(['Santiago', 'RM', 'Chile']);
    });
    it('falls back to the ocean', () => {
        const place = toPlace({ localityInfo: { informative: [{ name: 'Pacific Ocean' }] } });
        expect(place.name).toBe('Pacific Ocean');
        expect(place.photoQueries).toEqual(['Pacific Ocean']);
    });
    it('copes with empty data', () => {
        expect(toPlace({}).name).toBe('Open ocean');
        expect(toPlace({}, 'Mar abierto').name).toBe('Mar abierto');
    });
});
