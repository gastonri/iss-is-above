import { formatCoordinate, formatNumber, visibilityLabel } from '../lib/format';
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
    return (
        <aside className="panel">
            <dl className="stats">
                <Stat label="Latitude" value={position ? formatCoordinate(position.latitude, 'lat') : '–'} />
                <Stat label="Longitude" value={position ? formatCoordinate(position.longitude, 'lon') : '–'} />
                <Stat label="Altitude" value={position ? `${formatNumber(position.altitude)} km` : '–'} />
                <Stat label="Speed" value={position ? `${formatNumber(position.velocity)} km/h` : '–'} />
            </dl>
            {position && <p className="visibility">{visibilityLabel(position.visibility)}</p>}

            <figure className="photo">
                {loadingPhoto && <div className="photo__skeleton" aria-busy />}
                {!loadingPhoto && photo && (
                    <>
                        <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                        <figcaption>
                            <strong>{photo.title}</strong>
                            <p>{photo.extract}</p>
                            <a href={photo.pageUrl} target="_blank" rel="noreferrer">
                                Read more on Wikipedia →
                            </a>
                        </figcaption>
                    </>
                )}
                {!loadingPhoto && !photo && (
                    <p className="photo__empty">
                        {place ? `No photo found for ${place.name}.` : 'Waiting for the first fix…'}
                    </p>
                )}
            </figure>
        </aside>
    );
}
