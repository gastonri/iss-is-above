import { useI18n } from '../lib/i18n';

export default function About() {
    const { t } = useI18n();
    return (
        <section className="about" aria-labelledby="about-title">
            <h2 id="about-title">{t.aboutTitle}</h2>
            <p className="about__lead">{t.aboutLead}</p>
            <p className="about__body">{t.aboutBody}</p>
            <ul className="facts">
                {t.facts.map((fact) => (
                    <li key={fact.label}>
                        <strong>{fact.value}</strong>
                        <span>{fact.label}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
