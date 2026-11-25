import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import { splitAtAntimeridian } from '../lib/format';
import type { IssPosition } from '../lib/types';

const issIcon = L.divIcon({
    className: 'iss-marker',
    html: '<span class="iss-marker__ring"></span><span class="iss-marker__dot"></span>',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

/** Keeps the map centred on the station as it moves. */
function Follow({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.panTo(center, { animate: true, duration: 1.5 });
    }, [center, map]);
    return null;
}

interface Props {
    position: IssPosition | null;
    trail: [number, number][];
}

export default function IssMap({ position, trail }: Props) {
    const center: [number, number] = position ? [position.latitude, position.longitude] : [20, 0];

    return (
        <MapContainer center={center} zoom={4} minZoom={2} worldCopyJump className="map" attributionControl={false}>
            <TileLayer
                className="map-tiles"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={10}
            />
            {splitAtAntimeridian(trail).map((segment, i) => (
                <Polyline key={i} positions={segment} pathOptions={{ color: '#5eead4', weight: 2, opacity: 0.7, dashArray: '2 6' }} />
            ))}
            {position && (
                <>
                    <Marker position={center} icon={issIcon} />
                    <Follow center={center} />
                </>
            )}
        </MapContainer>
    );
}
