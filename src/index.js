import Header from './Header';
import get from 'lodash.get';
import Maps from './map';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const root = document.getElementById('root');

const App = () => {
    let latitude;
    let longitude;
    const title = 'The ISS is above';

    const [issLocation, setIssLocation] = useState({});

    useEffect(() => {
        getISSLocation().then((data) => {
            setIssLocation(data);
        });
    }, [])

    latitude = get(issLocation, 'iss_position.latitude', '');
    longitude = get(issLocation, 'iss_position.longitude', '');

    return (
        <div>
            <Header title={title} />
            <Header title={latitude} />
            <Header title={longitude} />
            <Maps latitude={latitude} longitude={longitude} />
        </div>
    );
};

const getISSLocation = async () => {
    const data = await fetch('http://api.open-notify.org/iss-now', {
        method: 'GET'
    });
    const location = await data.json();

    return location;
};

ReactDOM.render(<App />, root);
