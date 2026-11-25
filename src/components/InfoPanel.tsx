import { formatCoordinate, formatNumber } from '../lib/format';
import { useI18n } from '../lib/i18n';
import type { IssPosition, Photo, Place } from '../lib/types';

interface Props {
    position: IssPosition | null;
    place: Place | null;
    photo: Photo | null;
    loadingPhoto: boolean;
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="stat">
            <dt>{label}</dt>
            <dd>{value}</dd>
        </div>
    );
}

export default function InfoPanel({ position, place, photo, loadingPhoto }: Props) {
    const { lang, t } = useI18n();
    const visibility = position ? t[position.visibility === 'daylight' ? 'daylight' : position.visibility === 'visible' ? 'visible' : 'eclipsed'] : '';

    return (
        <aside className="panel">
            <dl className="stats">
                <Stat label={t.latitude} value={position ? formatCoordinate(position.latitude, 'lat', lang) : '–'} />
                <Stat label={t.longitude} value={position ? formatCoordinate(position.longitude, 'lon', lang) : '–'} />
                <Stat label={t.altitude} value={position ? `${formatNumber(position.altitude, 0, lang)} km` : '–'} />
                <Stat label={t.speed} value={position ? `${formatNumber(position.velocity, 0, lang)} km/h` : '–'} />
            </dl>
            {position && <p className="visibility">{visibility}</p>}

            <figure className="photo">
                {loadingPhoto && <div className="photo__skeleton" aria-busy />}
                {!loadingPhoto && photo && (
                    <>
                        <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                        <figcaption>
                            <strong>{photo.title}</strong>
                            <p>{photo.extract}</p>
                            <a href={photo.pageUrl} target="_blank" rel="noreferrer">
                                {t.readMore}
                            </a>
                        </figcaption>
                    </>
                )}
                {!loadingPhoto && !photo && (
                    <p className="photo__empty">{place ? t.noPhoto(place.name) : t.waiting}</p>
                )}
            </figure>
        </aside>
    );
}
