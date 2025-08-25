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
      {/* Header */}
      <header className="bg-[#4b3621] text-[#f5f1eb] py-10 shadow-md">
        <div className="container mx-auto flex flex-col items-center px-6 text-center">
          <img
            src="/logo.png"
            alt="Logo Centro"
            className="w-24 h-24 mb-4 shadow-md"
            style={{ border: "none" }}
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2">
            Centro de Pensamiento Económico
          </h1>
          <p className="text-[#e0d8cf] text-lg max-w-2xl">
            Un espacio académico y plural para explorar escuelas económicas,
            reflexionar sobre el presente y abrir caminos hacia el futuro.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        /* Quiénes somos */
          <section className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-semibold mb-4">
              Quiénes Somos
            </h2>
            <p className="leading-relaxed">
              Somos un centro académico independiente, dedicado a la investigación
              y la difusión del pensamiento económico en sus diversas corrientes.
              Nuestro objetivo es promover el diálogo crítico y el análisis
              riguroso para enriquecer la comprensión de la sociedad y sus
              desafíos.
            </p>
          </section>

          {/* Escuelas */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-[#8c6a4c] pb-2">
            Escuelas Económicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schoolData.map((s) => (
              <SchoolCard key={s.path} {...s} />
            ))}
          </div>
        </section>

        {/* Artículos */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-[#8c6a4c] pb-2">
            Muestras de Artículos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <section className="mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-[#8c6a4c] pb-2">
            Suscríbete a Nuestra Newsletter
          </h2>
          <p className="mb-4">
            Recibe actualizaciones, reflexiones académicas y noticias sobre
            pensamiento económico directamente en tu correo.
          </p>
          <NewsletterForm />
        </section>

        {/* Subir artículo */}
        <section className="mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-[#8c6a4c] pb-2">
            Envío de Artículos para Revisión
          </h2>
          <p className="mb-4">
            Contribuye a nuestra comunidad académica enviando tus reflexiones y
            análisis. Nuestro equipo revisará tu propuesta con seriedad y
            apertura intelectual.
          </p>
          <div className="p-4 border rounded-xl shadow-sm bg-[#fdfaf5]">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfQmaiiXnGXcodgTCL-gAMKlqG-lnh3_xDc1GIoYttEpqD3eg/viewform?embedded=true"
              width="100%"
              height="600"
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

      {/* Footer */}
      <footer className="bg-[#4b3621] text-[#f5f1eb] py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Centro de Pensamiento Económico. Todos
          los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
