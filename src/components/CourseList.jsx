// CourseList.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { loadCSV } from '../services/csvLoader.js';

// Función para quitar tildes y normalizar
function normalize(str) {
  return str
    ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    : '';
}

const CourseCard = ({ course, onClick }) => (
  <div 
    className="border rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all bg-white"
    onClick={onClick}
  >
    {course['Miniatura'] || course['Imagen'] ? (
      <img
        src={course['Miniatura'] || course['Imagen']}
        alt={course['Curso']}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
    ) : (
      <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
        <span className="text-gray-500">Imagen no disponible</span>
      </div>
    )}
    <h3 className="text-xl font-semibold text-gray-900">{course['Curso']}</h3>
    <p className="text-gray-600 text-sm mt-2">
      {(course['Descripción'] || '').slice(0, 100)}{course['Descripción'] && course['Descripción'].length > 100 ? '...' : ''}
    </p>
    <p className="text-sm text-gray-500 mt-1">Embárcate en este curso apasionante y transforma tu visión económica.</p>
  </div>
);

const CourseList = ({ school }) => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    loadCSV('courses')
      .then(data => {
        console.log('Cursos recibidos:', data);
        const normalizedSchool = normalize(school);
        const filtered = data.filter(c =>
          c['Escuela'] &&
          c['Escuela']
            .split(';')
            .map(s => normalize(s))
            .includes(normalizedSchool)
        );
        setCourses(filtered);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [school]);

  const fuse = new Fuse(courses, { keys: ['Curso', 'Descripción', 'Tema'], threshold: 0.3 });
  const results = search ? fuse.search(search).map(r => r.item) : courses;
  const showResults = results.slice(0, visible);

  if (loading) return <p className="text-center text-gray-600">Cargando cursos...</p>;
  if (error) return <p className="text-center text-red-500">Error al cargar cursos: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (courses.length === 0) return <p className="text-center text-gray-600">No hay cursos disponibles para esta escuela.</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por curso, tema..."
        className="mb-6 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showResults.map(c => (
          <CourseCard
            key={c['Curso']}
            course={c}
            onClick={() => navigate(`/${school}/courses/${encodeURIComponent(normalize(c['Curso']))}`)} // Normalizar en URL para consistencia
          />
        ))}
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        {visible < results.length && (
          <button onClick={() => setVisible(v => v + 5)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Mostrar más
          </button>
        )}
        {visible > 5 && (
          <button onClick={() => setVisible(5)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
            Mostrar menos
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseList;