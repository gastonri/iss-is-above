import { useEffect, useRef, useState } from 'react';
import { fetchPhoto, fetchPlace } from '../lib/api';
import { useI18n } from '../lib/i18n';
import type { IssPosition, Photo, Place } from '../lib/types';

/** Only look the place up again after the station has moved this many degrees. */
const MIN_MOVE_DEG = 2;

export function usePlace(position: IssPosition | null) {
    const { lang, t } = useI18n();
    const [place, setPlace] = useState<Place | null>(null);
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [loadingPhoto, setLoadingPhoto] = useState(false);
    const lastLookup = useRef<{ lat: number; lon: number; lang: string } | null>(null);
    const lastPlaceKey = useRef('');

    useEffect(() => {
        if (!position) return;
        const { latitude: lat, longitude: lon } = position;
        const last = lastLookup.current;
        if (last && last.lang === lang && Math.hypot(lat - last.lat, (lon - last.lon) * Math.cos((lat * Math.PI) / 180)) < MIN_MOVE_DEG) return;
        lastLookup.current = { lat, lon, lang };

        const controller = new AbortController();
        (async () => {
            try {
                const nextPlace = await fetchPlace(lat, lon, lang, t.openOcean, controller.signal);
                setPlace(nextPlace);

                const key = `${lang}:${nextPlace.photoQueries.join('|')}`;
                if (key === lastPlaceKey.current) return;
                lastPlaceKey.current = key;

                setLoadingPhoto(true);
                setPhoto(await fetchPhoto(nextPlace.photoQueries, lang, controller.signal));
                setLoadingPhoto(false);
            } catch {
                // Aborted or network failure: keep whatever we already show.
                if (!controller.signal.aborted) setLoadingPhoto(false);
                lastLookup.current = null; // retry on the next position update
            }
        })();

        return () => controller.abort();
    }, [position, lang, t.openOcean]);

    return { place, photo, loadingPhoto };
}
