import { useEffect, useState } from 'react';
import { CORDOBA, distanceKm, updatePasses, type Pass } from '../lib/passes';
import type { IssPosition } from '../lib/types';

const STORAGE_KEY = 'iss-is-above:cordoba-passes:v1';

function load(): Pass[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? (parsed as Pass[]) : [];
    } catch {
        return [];
    }
}

export function usePassLog(position: IssPosition | null) {
    const [passes, setPasses] = useState<Pass[]>(load);
    const distance = position
        ? distanceKm(position.latitude, position.longitude, CORDOBA.latitude, CORDOBA.longitude)
        : null;

    useEffect(() => {
        if (!position) return;
        const d = distanceKm(position.latitude, position.longitude, CORDOBA.latitude, CORDOBA.longitude);
        setPasses((prev) => updatePasses(prev, d, position.timestamp * 1000));
    }, [position]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
        } catch {
            // Storage full or blocked: the log still works for this session.
        }
    }, [passes]);

    const clear = () => setPasses([]);

    return { passes, distance, clear };
}
