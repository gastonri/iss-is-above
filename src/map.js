import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import React from 'react';

const styles = {
    wrapper: {
        height: '70vh',
        width: '80%',
        margin: '0 auto',
        display: 'flex'
    },
    map: {
        flex: 1
    }
};

const Maps = (props) => {
    const position = [props.latitude, props.longitude];
    // const position = [18.4456, -143.0243];

    return (
        <div style={styles.wrapper}>
            <Map style={styles.map} center={position} zoom={5}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup.
                        <br />
                        Easily customizable.
                    </Popup>
                </Marker>
            </Map>
        </div>
    );
};

export default Maps;
