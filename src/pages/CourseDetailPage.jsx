import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCSV } from '../services/csvLoader.js';
import ReactPlayer from 'react-player';

const CourseDetailPage = () => {
  const { school, course } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    loadCSV('courses')
      .then(data => {
        console.log('Courses CSV data:', data); // Debug: Log all courses
        const decodedCourse = decodeURIComponent(course).trim();
        const found = data.find(c => c['Curso']?.trim().toLowerCase() === decodedCourse.toLowerCase());
        if (!found) {
          console.error('Course not found for name:', decodedCourse);
          throw new Error('Curso no encontrado');
        }
        setCourseData(found);
        return loadCSV('modules');
      })
      .then(data => {
        console.log('Modules CSV data:', data); // Debug: Log all modules
        const filtered = data.filter(m => m['Curso']?.trim().toLowerCase() === courseData['Curso']?.trim().toLowerCase())
          .sort((a, b) => (a['Número de Módulo'] || 0) - (b['Número de Módulo'] || 0));
        setModules(filtered);
        setError(null);
      })
      .catch(err => {
        console.error('Error loading course or modules:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [course]);

  if (loading) return <p>Cargando curso...</p>;
  if (error) return <p>Error: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (!courseData) return <p>Curso no encontrado.</p>;

  return (
    <div className="detail-page">
      <button onClick={() => navigate(`/${school}`)} className="mb-4 bg-blue-500 text-white p-2 rounded">Volver</button>
      <h1 className="text-2xl font-bold">{courseData['Curso']}</h1>
      <p>{courseData['Descripción']}</p>
      {modules.map(m => (
        <div key={m['Número de Módulo'] || m['Descripción de Módulo']} className="mt-4">
          <h3>{m['Descripción de Módulo']}</h3>
          <ReactPlayer url={m['Link (Youtube)']} controls width="100%" />
          <button onClick={() => window.open(m['Link (Youtube)'], '_blank')} className="bg-blue-500 text-white p-2 rounded">Abrir en YouTube</button>
          {m['Formulario de Módulo'] && <a href={m['Formulario de Módulo']} target="_blank" className="ml-2 text-blue-500">Formulario</a>}
        </div>
      ))}
    </div>
  );
};

export default CourseDetailPage;