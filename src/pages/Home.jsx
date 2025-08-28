import { useState, useEffect } from "react";
import NewsletterForm from "../components/NewsletterForm.jsx";
import SchoolCard from "../components/SchoolCard.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import { loadCSV } from "../services/csvLoader.js";

const schoolData = [
  {
    path: "austrian",
    label: "Escuela Austríaca",
    description: "Explora ideas libertarias y de mercado libre.",
  },
  {
    path: "marxist",
    label: "Escuela Marxista",
    description: "Descubre perspectivas críticas del capital.",
  },
  // más escuelas aquí
];

const Home = () => {
  const [samples, setSamples] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadCSV("articles").then((data) => setSamples(data.slice(0, 3)));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1eb] text-[#3e2f2a]">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Quiénes somos */}
        <section className="mb-12 max-w-3xl mx-auto text-center px-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4">
            Quiénes Somos
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Somos un centro académico independiente, dedicado a la investigación
            y difusión de la economía. Promovemos el diálogo crítico
            y el análisis riguroso para enriquecer la comprensión de la sociedad
            y sus desafíos.
          </p>
        </section>

        {/* Escuelas */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 border-b border-[#8c6a4c] pb-2 text-center sm:text-left">
            Escuelas Económicas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {schoolData.map((s) => (
              <SchoolCard key={s.path} {...s} />
            ))}
          </div>
        </section>

        {/* Artículos */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 border-b border-[#8c6a4c] pb-2 text-center sm:text-left">
            Muestras de Artículos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {samples.map((a) => (
              <ArticleCard
                key={a["Título"]}
                article={a}
                onClick={() => setSelected(a)}
              />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mb-12 max-w-2xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 border-b border-[#8c6a4c] pb-2 text-center sm:text-left">
            Suscríbete a Nuestro Newsletter
          </h2>
          <p className="mb-4 text-sm sm:text-base">
            Recibe actualizaciones, reflexiones académicas y noticias sobre
            economía directamente en tu correo.
          </p>
          <NewsletterForm />
        </section>

        {/* Subir artículo */}
        <section className="mb-12 max-w-2xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 border-b border-[#8c6a4c] pb-2 text-center sm:text-left">
            Envío de Artículos para Revisión
          </h2>
          <p className="mb-4 text-sm sm:text-base">
            Contribuye a nuestra comunidad académica enviando tus reflexiones y
            análisis. Nuestro equipo revisará tu propuesta con seriedad y
            apertura intelectual.
          </p>
          <div className="p-3 sm:p-4 border rounded-xl shadow-sm bg-[#fdfaf5]">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfQmaiiXnGXcodgTCL-gAMKlqG-lnh3_xDc1GIoYttEpqD3eg/viewform?embedded=true"
              width="100%"
              height="500"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Subir artículo"
              className="rounded-md"
            >
              Cargando...
            </iframe>
          </div>
        </section>

        {selected && (
          <ArticleDetail
            article={selected}
            onClose={() => setSelected(null)}
            school="general"
          />
        )}
      </main>
    </div>
  );
};

export default Home;
