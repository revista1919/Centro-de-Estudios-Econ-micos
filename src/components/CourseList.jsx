import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { loadCSV } from '../services/csvLoader.js';
import ReactPlayer from 'react-player';

const CourseCard = ({ course, onClick }) => (
  <div className="border p-4 cursor-pointer hover:bg-gray-100" onClick={onClick}>
    <h3 className="text-lg font-bold">{course['Curso']}</h3>
    <p>{course['Descripción']}</p>
    <p className="text-sm text-gray-600">Embárcate en este curso apasionante y transforma tu visión económica.</p>
  </div>
);

const CourseDetail = ({ course, onClose }) => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    loadCSV('modules').then(data => {
      const filtered = data.filter(m => m['Curso'] === course['Curso']).sort((a, b) => a['Número de Módulo'] - b['Número de Módulo']);
      setModules(filtered);
    });
  }, [course]);

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Cerrar</button>
        <h1 className="text-2xl font-bold">{course['Curso']}</h1>
        <p>{course['Descripción']}</p>
        {modules.map(m => (
          <div key={m['Número de Módulo']} className="mt-4">
            <h3>{m['Descripción de Módulo']}</h3>
            <ReactPlayer url={m['Link (Youtube)']} controls width="100%" />
            <button onClick={() => window.open(m['Link (Youtube)'], '_blank')}>Abrir en YouTube</button>
            {m['Formulario de Módulo'] && <a href={m['Formulario de Módulo']} target="_blank" className="ml-2">Formulario</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseList = ({ school }) => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(5);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadCSV('courses').then(data => {
      const filtered = data.filter(c => c['Escuela'].split(';').map(s => s.trim()).includes(school));
      setCourses(filtered);
    });
  }, [school]);

  const fuse = new Fuse(courses, { keys: ['Curso', 'Descripción', 'Tema'] });
  const results = search ? fuse.search(search).map(r => r.item) : courses;
  const showResults = results.slice(0, visible);

  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por curso, tema..." className="mb-4 block w-full p-2 border" />
      <div className="grid gap-4">
        {showResults.map(c => <CourseCard key={c['Curso']} course={c} onClick={() => setSelected(c)} />)}
      </div>
      <div className="mt-4">
        {visible < results.length && <button onClick={() => setVisible(v => v + 5)} className="mr-2">Mostrar más</button>}
        {visible > 5 && <button onClick={() => setVisible(5)}>Mostrar menos</button>}
      </div>
      {selected && <CourseDetail course={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default CourseList;