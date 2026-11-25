import InfoPanel from './components/InfoPanel';
import IssMap from './components/IssMap';
import { useIss } from './hooks/useIss';
import { usePlace } from './hooks/usePlace';

export default function App() {
    const { position, trail, status } = useIss();
    const { place, photo, loadingPhoto } = usePlace(position);

    return (
        <div className="app">
            <header className="header">
                <p className="eyebrow">
                    <span className={`pulse pulse--${status}`} aria-hidden />
                    {status === 'live' ? 'Live' : status === 'error' ? 'Reconnecting…' : 'Locating…'}
                </p>
                <h1>
                    The ISS is above <span className="accent">{place?.name ?? '…'}</span>
                </h1>
                {place?.detail && <p className="subtitle">{place.detail}</p>}
            </header>

            <main className="layout">
                <section className="map-card" aria-label="Map of the ISS position">
                    <IssMap position={position} trail={trail} />
                </section>
                <InfoPanel position={position} place={place} photo={photo} loadingPhoto={loadingPhoto} />
            </main>

            <footer className="footer">
                Data from <a href="https://wheretheiss.at">wheretheiss.at</a>,{' '}
                <a href="https://www.bigdatacloud.com">BigDataCloud</a> and{' '}
                <a href="https://www.wikipedia.org">Wikipedia</a>. Map © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>.
            </footer>
        </div>
    );
}
