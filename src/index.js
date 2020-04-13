import Header from './Header';
import get from 'lodash.get';
import Maps from './map';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const root = document.getElementById('root');

const GEOCODING_API_KEY = '1f370d1969f280';
const IMAGES_API_KEY = '16010999-449368643464d52520b340013';

const App = () => {
    let latitude;
    let longitude;
    const title = 'The ISS is above';

    const [issLocation, setIssLocation] = useState({});
    const [city, setCity] = useState('');

    useEffect(() => {
        getISSLocation().then((data) => {
            setIssLocation(data);
            getCities(data).then((city) => {
                setCity(city);
                getImages(city);
            });
        });
    }, []);

    latitude = get(issLocation, 'iss_position.latitude', '10.3224972');
    longitude = get(issLocation, 'iss_position.longitude', '-72.3166197');

    return (
        <div>
            <Header title={title} />
            <Header title={latitude} />
            <Header title={longitude} />
            <Header title={city} />
            <Maps latitude={latitude} longitude={longitude} />
        </div>
    );
};

const getISSLocation = async () => {
    let location;

    try {
        const data = await fetch(
            'https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now'
        );
        location = await data.json();
    } catch (error) {
        console.log(error);
    }

    return location;
};

const getCities = async (coordinates) => {
    const latitude = get(coordinates, 'iss_position.latitude', '0');
    const longitude = get(coordinates, 'iss_position.longitude', '0');

    let city = '';

    try {
        const data = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${GEOCODING_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
        );
        const location = await data.json();
        console.log;
        city = get(location, 'address.city', '');
    } catch (error) {
        console.log(error);
    }

    return city;
};

const getImages = async (name) => {
    const codedName = name.split(' ').join('+');
    let images = {};

    try {
        const data = await fetch(`https://pixabay.com/api/?key=${IMAGES_API_KEY}&q=${codedName}`, {
            mode: 'no-cors'
        });
        images = await data.json();

        console.log(images);
    } catch (error) {
        console.log(error);
    }

    return images;
};

const callServices = async (url, headers) => {
    try {
        const response = await fetch(url, headers);
        return response.json();
    } catch (error) {
        console.log(error);
    }
};

ReactDOM.render(<App />, root);
