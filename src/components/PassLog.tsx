import { formatNumber } from '../lib/format';
import { LOCALES, useI18n } from '../lib/i18n';
import { NEAR_RADIUS_KM, type Pass } from '../lib/passes';

interface Props {
    passes: Pass[];
    distance: number | null;
    onClear: () => void;
}

export default function PassLog({ passes, distance, onClear }: Props) {
    const { lang, t } = useI18n();
    const near = distance !== null && distance <= NEAR_RADIUS_KM;
    const dateFmt = new Intl.DateTimeFormat(LOCALES[lang], { dateStyle: 'medium', timeStyle: 'short' });
    const timeFmt = new Intl.DateTimeFormat(LOCALES[lang], { timeStyle: 'short' });
    const km = (value: number) => formatNumber(value, 0, lang);

    const minutes = (pass: Pass) =>
        Math.max(1, Math.round(((pass.endedAt ?? pass.lastSeenAt) - pass.startedAt) / 60000));

    return (
        <section className="card log" aria-label={t.passesAria}>
            <div className="log__head">
                <div>
                    <h2>{t.passesTitle}</h2>
                    <p className="log__hint">
                        {distance === null ? t.waiting : near ? t.overheadNow(km(distance)) : t.away(km(distance))}
                        {' · '}
                        {t.radiusNote(NEAR_RADIUS_KM)}
                    </p>
                </div>
                {passes.length > 0 && (
                    <button type="button" className="log__clear" onClick={onClear}>
                        {t.clear}
                    </button>
                )}
            </div>

            {passes.length === 0 ? (
                <p className="log__empty">{t.noPasses}</p>
            ) : (
                <ul className="log__list">
                    {passes.map((pass) => (
                        <li key={pass.id} className={pass.endedAt === undefined ? 'log__item log__item--live' : 'log__item'}>
                            <span className="log__when">
                                {dateFmt.format(pass.startedAt)}
                                {pass.endedAt !== undefined
                                    ? ` ${t.to} ${timeFmt.format(pass.endedAt)}`
                                    : ` · ${t.now}`}
                            </span>
                            <span className="log__meta">
                                {t.closest(km(pass.closestKm), timeFmt.format(pass.closestAt))} · {minutes(pass)} min
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
