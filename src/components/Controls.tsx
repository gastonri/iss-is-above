import { useI18n, type Lang } from '../lib/i18n';
import type { Theme } from '../hooks/useTheme';

const LANGS: Lang[] = ['es', 'en'];

export default function Controls({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
    const { lang, setLang, t } = useI18n();
    const label = theme === 'dark' ? t.themeToLight : t.themeToDark;

    return (
        <div className="controls">
            <div className="segmented" role="group" aria-label={t.langLabel}>
                {LANGS.map((code) => (
                    <button
                        key={code}
                        type="button"
                        aria-pressed={lang === code}
                        onClick={() => setLang(code)}
                    >
                        {code.toUpperCase()}
                    </button>
                ))}
            </div>
            <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label={label} title={label}>
                {theme === 'dark' ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
