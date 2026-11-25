import { formatNumber } from '../lib/format';
import { CORDOBA, NEAR_RADIUS_KM, type Pass } from '../lib/passes';

interface Props {
    passes: Pass[];
    distance: number | null;
    onClear: () => void;
}

const dateFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
const timeFmt = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' });

function duration(pass: Pass): string {
    const end = pass.endedAt ?? pass.lastSeenAt;
    const minutes = Math.max(1, Math.round((end - pass.startedAt) / 60000));
    return `${minutes} min`;
}

export default function PassLog({ passes, distance, onClear }: Props) {
    const near = distance !== null && distance <= NEAR_RADIUS_KM;

    return (
        <section className="log" aria-label={`Passes near ${CORDOBA.name}`}>
            <div className="log__head">
                <div>
                    <h2>Passes near Córdoba</h2>
                    <p className="log__hint">
                        {distance === null
                            ? 'Waiting for the first fix…'
                            : near
                              ? `Overhead right now, ${formatNumber(distance)} km away`
                              : `${formatNumber(distance)} km away`}
                        {' · '}within {NEAR_RADIUS_KM} km counts as a pass
                    </p>
                </div>
                {passes.length > 0 && (
                    <button type="button" className="log__clear" onClick={onClear}>
                        Clear
                    </button>
                )}
            </div>

            {passes.length === 0 ? (
                <p className="log__empty">
                    No passes yet. They are recorded in this browser while the page is open.
                </p>
            ) : (
                <ul className="log__list">
                    {passes.map((pass) => (
                        <li key={pass.id} className={pass.endedAt === undefined ? 'log__item log__item--live' : 'log__item'}>
                            <span className="log__when">
                                {dateFmt.format(pass.startedAt)}
                                {pass.endedAt !== undefined ? ` to ${timeFmt.format(pass.endedAt)}` : ' · now'}
                            </span>
                            <span className="log__meta">
                                closest {formatNumber(pass.closestKm)} km at {timeFmt.format(pass.closestAt)} ·{' '}
                                {duration(pass)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
