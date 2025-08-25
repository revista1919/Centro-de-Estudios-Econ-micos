import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ArticleList from '../components/ArticleList.jsx';
import CourseList from '../components/CourseList.jsx';
import BiographyList from '../components/BiographyList.jsx';
import BookList from '../components/BookList.jsx';
import ScholarshipList from '../components/ScholarshipList.jsx';

const schoolMap = {
  austrian: 'austriaca',
  marxist: 'marxista',
  neoclassical: 'neoclásica',
  keynesian: 'keynesiana',
  behavioral: 'conductual',
  postkeynesian: 'postkeynesiana',
  monetarist: 'monetarista',
  institutionalist: 'institucionalista',
};

const sections = {
  articulos: ArticleList,
  cursos: CourseList,
  biografias: BiographyList,
  libros: BookList,
  becas: ScholarshipList,
};

const SchoolPage = () => {
  const { school } = useParams();
  const schoolName = schoolMap[school] || school;
  const [currentSection, setCurrentSection] = useState('articulos');

  const SectionComponent = sections[currentSection];

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
        <h1 className="text-3xl font-bold mb-4">Escuela {schoolName.charAt(0).toUpperCase() + schoolName.slice(1)}</h1>
        <p>Descubre contenido inspirador y profundo sobre esta escuela económica.</p>
        <SectionComponent school={schoolName} />
      </main>
    </div>
  );
};

export default SchoolPage;