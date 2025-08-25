import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ArticleList from '../components/ArticleList.jsx';
import CourseList from '../components/CourseList.jsx';
import BiographyList from '../components/BiographyList.jsx';
import BookList from '../components/BookList.jsx';
import ScholarshipList from '../components/ScholarshipList.jsx';
import { loadCSV } from '../services/csvLoader.js';

// Función para quitar tildes y normalizar
function normalize(str) {
  return str
    ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : '';
}

const schoolMap = {
  austrian: 'austriaca',
  marxist: 'marxista',
  neoclassical: 'neoclasica',
  keynesian: 'keynesiana',
  behavioral: 'conductual',
  postkeynesian: 'postkeynesiana',
  monetarist: 'monetarista',
  institutionalist: 'institucionalista',
};

const sections = {
  articulos: { component: ArticleList, key: 'articles' },
  cursos: { component: CourseList, key: 'courses' },
  biografias: { component: BiographyList, key: 'biographies' },
  libros: { component: BookList, key: 'books' },
  becas: { component: ScholarshipList, key: 'scholarships' },
};

const SchoolPage = () => {
  const { school } = useParams();
  // Normaliza el nombre de la escuela para comparar y filtrar
  const schoolName = schoolMap[school] || school;
  const normalizedSchool = normalize(schoolName);
  const [currentSection, setCurrentSection] = useState('articulos');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newData = {};
      for (const sectionKey in sections) {
        const csvKey = sections[sectionKey].key;
        try {
          newData[sectionKey] = await loadCSV(csvKey);
        } catch (e) {
          newData[sectionKey] = [];
        }
      }
      setData(newData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const SectionComponent = sections[currentSection].component;
  const sectionData = data[currentSection] || [];

  return (
    <div className="container mx-auto p-4 flex">
      <aside className="w-1/4 pr-4">
        <h2 className="text-xl font-bold mb-4">Secciones</h2>
        <ul>
          <li><button onClick={() => setCurrentSection('articulos')}>Artículos</button></li>
          <li><button onClick={() => setCurrentSection('cursos')}>Cursos</button></li>
          <li><button onClick={() => setCurrentSection('biografias')}>Biografías</button></li>
          <li><button onClick={() => setCurrentSection('libros')}>Libros</button></li>
          <li><button onClick={() => setCurrentSection('becas')}>Becas</button></li>
        </ul>
      </aside>
      <main className="w-3/4">
        <h1 className="text-3xl font-bold mb-4">
          Escuela {schoolName.charAt(0).toUpperCase() + schoolName.slice(1)}
        </h1>
        <p>Descubre contenido inspirador y profundo sobre esta escuela económica.</p>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          // Pasa school normalizado para que los componentes filtren bien
          <SectionComponent school={normalizedSchool} data={sectionData} />
        )}
      </main>
    </div>
  );
};

export default SchoolPage;