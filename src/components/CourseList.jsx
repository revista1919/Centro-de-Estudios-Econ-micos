import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { loadCSV } from '../services/csvLoader.js';

const CourseCard = ({ course, onClick }) => (
  <div className="border p-4 cursor-pointer hover:bg-gray-100" onClick={onClick}>
    <h3 className="text-lg font-bold">{course['Curso']}</h3>
    <p>{course['Descripción'].slice(0, 100)}...</p>
    <p className="text-sm text-gray-600">Embárcate en este curso apasionante y transforma tu visión económica.</p>
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
        const filtered = data.filter(c => c['Escuela']?.split(';').map(s => s.trim().toLowerCase()).includes(school.toLowerCase()));
        setCourses(filtered);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [school]);

  const fuse = new Fuse(courses, { keys: ['Curso', 'Descripción', 'Tema'], threshold: 0.3 });
  const results = search ? fuse.search(search).map(r => r.item) : courses;
  const showResults = results.slice(0, visible);

  if (loading) return <p>Cargando cursos...</p>;
  if (error) return <p>Error al cargar cursos: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (courses.length === 0) return <p>No hay cursos disponibles para esta escuela.</p>;

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por curso, tema..."
        className="mb-4 block w-full p-2 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showResults.map(c => (
          <CourseCard
            key={c['Curso']}
            course={c}
            onClick={() => navigate(`/${school}/courses/${encodeURIComponent(c['Curso'])}`)}
          />
        ))}
      </div>
      <div className="mt-4">
        {visible < results.length && <button onClick={() => setVisible(v => v + 5)} className="mr-2 bg-blue-500 text-white p-2 rounded">Mostrar más</button>}
        {visible > 5 && <button onClick={() => setVisible(5)} className="bg-gray-500 text-white p-2 rounded">Mostrar menos</button>}
      </div>
    </div>
  );
};

export default CourseList;