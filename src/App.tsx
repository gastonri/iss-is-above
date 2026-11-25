import About from './components/About';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import IssMap from './components/IssMap';
import PassLog from './components/PassLog';
import { useIss } from './hooks/useIss';
import { usePassLog } from './hooks/usePassLog';
import { usePlace } from './hooks/usePlace';
import { useTheme } from './hooks/useTheme';
import { useI18n } from './lib/i18n';

export default function App() {
    const { t } = useI18n();
    const { theme, toggle } = useTheme();
    const { position, trail, status } = useIss();
    const { place, photo, loadingPhoto } = usePlace(position);
    const { passes, distance, clear } = usePassLog(position);

    return (
        <div className="app">
            <header className="header">
                <div className="header__top">
                    <p className="eyebrow">
                        <span className={`pulse pulse--${status}`} aria-hidden />
                        {status === 'live' ? t.live : status === 'error' ? t.reconnecting : t.locating}
                    </p>
                    <Controls theme={theme} onToggleTheme={toggle} />
                </div>
                <h1>
                    {t.titlePrefix} <span className="accent">{place?.name ?? '…'}</span>
                </h1>
                {place?.detail && <p className="subtitle">{place.detail}</p>}
            </header>

            <main className="layout">
                <section className="map-card" aria-label={t.mapLabel}>
                    <IssMap position={position} trail={trail} />
                </section>
                <InfoPanel position={position} place={place} photo={photo} loadingPhoto={loadingPhoto} />
            </main>

            <PassLog passes={passes} distance={distance} onClear={clear} />
            <About />

            <footer className="footer">
                {t.footerData} <a href="https://wheretheiss.at">wheretheiss.at</a>,{' '}
                <a href="https://www.bigdatacloud.com">BigDataCloud</a> &amp;{' '}
                <a href="https://www.wikipedia.org">Wikipedia</a>. {t.footerMap}{' '}
                <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>.
            </footer>
        </div>
    );
}
