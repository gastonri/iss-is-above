import { useEffect, useState } from 'react';
import { fetchIssPosition } from '../lib/api';
import type { IssPosition } from '../lib/types';

const POLL_MS = 5000;
const TRAIL_LENGTH = 180; // ~15 minutes of history

export type Status = 'loading' | 'live' | 'error';

export function useIss() {
    const [position, setPosition] = useState<IssPosition | null>(null);
    const [trail, setTrail] = useState<[number, number][]>([]);
    const [status, setStatus] = useState<Status>('loading');

    useEffect(() => {
        const controller = new AbortController();

        const tick = async () => {
            try {
                const next = await fetchIssPosition(controller.signal);
                setPosition(next);
                setTrail((prev) => [...prev, [next.latitude, next.longitude] as [number, number]].slice(-TRAIL_LENGTH));
                setStatus('live');
            } catch {
                if (!controller.signal.aborted) setStatus('error');
            }
        };

        tick();
        const id = setInterval(tick, POLL_MS);
        return () => {
            controller.abort();
            clearInterval(id);
        };
    }, []);

    return { position, trail, status };
}
