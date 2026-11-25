import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en';

export const LOCALES: Record<Lang, string> = { en: 'en-GB', es: 'es-AR' };

const en = {
    live: 'Live',
    reconnecting: 'Reconnecting…',
    locating: 'Locating…',
    titlePrefix: 'The ISS is above',
    openOcean: 'Open ocean',
    latitude: 'Latitude',
    longitude: 'Longitude',
    altitude: 'Altitude',
    speed: 'Speed',
    daylight: 'In daylight',
    visible: 'Visible from the ground',
    eclipsed: 'In Earth’s shadow',
    readMore: 'Read more on Wikipedia →',
    noPhoto: (name: string) => `No photo found for ${name}.`,
    waiting: 'Waiting for the first fix…',
    mapLabel: 'Map of the ISS position',
    aboutTitle: 'What is the ISS?',
    aboutLead:
        'The International Space Station is a crewed laboratory orbiting Earth about 400 km up. NASA, Roscosmos, ESA, JAXA and CSA built it together, and astronauts have lived aboard continuously since November 2000.',
    aboutBody:
        'Up there, in microgravity, crews run experiments in biology, medicine, materials and physics that cannot be done on the ground. This page asks for its position every 5 seconds and looks up what is underneath. Since about 71% of the planet is water, you will often see an ocean.',
    facts: [
        { value: '27,600 km/h', label: 'cruising speed' },
        { value: '≈ 93 min', label: 'per orbit' },
        { value: '16', label: 'sunrises a day' },
        { value: '109 m', label: 'long' }
    ],
    passesTitle: 'Passes near Córdoba',
    passesAria: 'Passes near Córdoba, Argentina',
    overheadNow: (km: string) => `Overhead right now, ${km} km away`,
    away: (km: string) => `${km} km away`,
    radiusNote: (km: number) => `within ${km} km counts as a pass`,
    noPasses: 'No passes yet. They are recorded in this browser while the page is open.',
    clear: 'Clear',
    to: 'to',
    now: 'now',
    closest: (km: string, time: string) => `closest ${km} km at ${time}`,
    footerData: 'Data from',
    footerMap: 'Map ©',
    langLabel: 'Language',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme'
};

export type Dictionary = typeof en;

const es: Dictionary = {
    live: 'En vivo',
    reconnecting: 'Reconectando…',
    locating: 'Localizando…',
    titlePrefix: 'La ISS está sobre',
    openOcean: 'Mar abierto',
    latitude: 'Latitud',
    longitude: 'Longitud',
    altitude: 'Altura',
    speed: 'Velocidad',
    daylight: 'A la luz del día',
    visible: 'Visible desde el suelo',
    eclipsed: 'En la sombra de la Tierra',
    readMore: 'Leer más en Wikipedia →',
    noPhoto: (name) => `No encontré una foto de ${name}.`,
    waiting: 'Esperando la primera posición…',
    mapLabel: 'Mapa con la posición de la ISS',
    aboutTitle: '¿Qué es la ISS?',
    aboutLead:
        'La Estación Espacial Internacional es un laboratorio habitado que orbita la Tierra a unos 400 km de altura. La construyeron en conjunto la NASA, Roscosmos, la ESA, la JAXA y la CSA, y desde noviembre de 2000 siempre hay astronautas a bordo.',
    aboutBody:
        'Ahí arriba, en microgravedad, las tripulaciones hacen experimentos de biología, medicina, materiales y física que no se pueden hacer en la Tierra. Esta página consulta su posición cada 5 segundos y busca qué hay debajo. Como alrededor del 71% del planeta es agua, muchas veces vas a ver un océano.',
    facts: [
        { value: '27.600 km/h', label: 'velocidad de crucero' },
        { value: '≈ 93 min', label: 'por vuelta' },
        { value: '16', label: 'amaneceres por día' },
        { value: '109 m', label: 'de largo' }
    ],
    passesTitle: 'Pasadas cerca de Córdoba',
    passesAria: 'Pasadas cerca de Córdoba, Argentina',
    overheadNow: (km) => `Pasando ahora mismo, a ${km} km`,
    away: (km) => `A ${km} km`,
    radiusNote: (km) => `a menos de ${km} km cuenta como pasada`,
    noPasses: 'Todavía no hay pasadas. Se registran en este navegador mientras la página está abierta.',
    clear: 'Borrar',
    to: 'a',
    now: 'ahora',
    closest: (km, time) => `más cerca ${km} km a las ${time}`,
    footerData: 'Datos de',
    footerMap: 'Mapa ©',
    langLabel: 'Idioma',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro'
};

const dictionaries: Record<Lang, Dictionary> = { en, es };
const STORAGE_KEY = 'iss-is-above:lang';

function initialLang(): Lang {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'es' || saved === 'en') return saved;
    } catch {
        /* storage blocked */
    }
    return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

interface I18n {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: Dictionary;
}

const Context = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>(initialLang);

    useEffect(() => {
        document.documentElement.lang = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            /* storage blocked */
        }
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useI18n(): I18n {
    const value = useContext(Context);
    if (!value) throw new Error('useI18n must be used inside <I18nProvider>');
    return value;
}
