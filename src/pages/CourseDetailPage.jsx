
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { loadCSV } from '../services/csvLoader.js';

// Función para quitar tildes y normalizar
function normalize(str) {
  if (typeof str !== 'string') {
    return ''; // Handle non-string input gracefully
  }
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
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
    <h3 className="text-xl font-semibold text-gray-900">{course['Curso'] || 'Curso sin título'}</h3> {/* Add fallback */}
    <p className="text-gray-600 text-sm mt-2">
      {(course['Descripción'] || '').slice(0, 100)}{course['Descripción'] && course['Descripción'].length > 100 ? '...' : ''}
    </p>
    {/* Added check for 'Embárcate...' paragraph */}
    {course['Descripción'] && <p className="text-sm text-gray-500 mt-1">Embárcate en este curso apasionante y transforma tu visión económica.</p>}
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
    setError(null); // Clear previous errors on school change

    // *** IMPORTANT: Verify 'courses' matches the actual CSV filename ***
    loadCSV('courses')
      .then(data => {
        console.log('Cursos recibidos (raw):', data); // Log the raw data
        if (!Array.isArray(data)) {
            console.error('loadCSV did not return an array:', data);
            setError('Invalid data format from CSV loader.');
            setLoading(false);
            return;
        }

        const normalizedSchool = normalize(school);
        console.log('Escuela normalizada:', normalizedSchool); // Log normalized school

        const filtered = data.filter(c => {
            // *** IMPORTANT: Check if 'Escuela' property exists and is a string ***
            if (!c['Escuela'] || typeof c['Escuela'] !== 'string') {
                // console.warn('Skipping course with missing or invalid "Escuela" property:', c);
                return false; // Exclude rows without a valid 'Escuela'
            }

            const courseSchools = c['Escuela']
                .split(';')
                .map(s => normalize(s));

            // console.log(`Course "${c['Curso']}" schools (normalized):`, courseSchools); // Optional: log schools for each course

            return courseSchools.includes(normalizedSchool);
        });

        console.log('Cursos filtrados:', filtered); // Log the filtered data
        setCourses(filtered);
        setLoading(false);
      })
      .catch(err => {
          console.error('Error loading or processing CSV:', err); // Log the actual error
          setError(`Error al cargar cursos: ${err.message}.`);
          setLoading(false); // Ensure loading state is turned off
      });
  }, [school]); // Dependency array ensures effect runs when school changes

  const fuse = new Fuse(courses, { keys: ['Curso', 'Descripción', 'Tema'], threshold: 0.3 });
  const results = search ? fuse.search(search).map(r => r.item) : courses;
  const showResults = results.slice(0, visible);

  if (loading) return <p className="text-center text-gray-600">Cargando cursos...</p>;
  if (error) return <p className="text-center text-red-500">Error al cargar cursos: {error}. Por favor, intenta de nuevo más tarde.</p>;
  // Check results.length instead of courses.length for the empty state message after filtering/searching
  if (results.length === 0 && !loading && !error) return <p className="text-center text-gray-600">No hay cursos disponibles para esta escuela o con la búsqueda actual.</p>;

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
            key={c['Curso'] || `course-${Math.random()}`} // Add a fallback key if 'Curso' is missing
            course={c}
            onClick={() => navigate(`/${school}/courses/${encodeURIComponent(normalize(c['Curso'] || ''))}`)} // Add fallback for URL
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
