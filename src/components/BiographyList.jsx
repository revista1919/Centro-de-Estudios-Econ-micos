import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { loadCSV } from '../services/csvLoader.js';

const BiographyCard = ({ bio, onClick }) => (
  <div className="border p-4 cursor-pointer hover:bg-gray-100" onClick={onClick}>
    <img src={bio['Foto']} alt="Foto" className="w-32 mb-2" />
    <h3 className="text-lg font-bold">{bio['Autor (Nombre y Apellido)']}</h3>
    <p className="text-sm">{bio['Biografía'].slice(0, 100)}...</p>
    <p className="text-sm text-gray-600">Conoce la vida inspiradora de este pensador económico.</p>
  </div>
);

const BiographyDetail = ({ bio, onClose }) => {
  const [books, setBooks] = useState([]);
  const [parsedObras, setParsedObras] = useState([]);

  useEffect(() => {
    loadCSV('books').then(data => {
      setBooks(data);
      const obras = bio['Obras clave (Nombre del libro, Año)'].split(';').map(o => o.trim());
      const parsed = obras.map(o => {
        const [name, year] = o.split(',');
        const available = data.some(b => b['Título'] === name.trim());
        return { name: name.trim(), year: year ? year.trim() : '', available };
      });
      setParsedObras(parsed);
    });
  }, [bio]);

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Cerrar</button>
        <img src={bio['Foto']} alt="Foto" className="w-48 mb-4" />
        <h1 className="text-2xl font-bold">{bio['Autor (Nombre y Apellido)']}</h1>
        <p className="content">{bio['Biografía']}</p>
        <h3>Obras Clave</h3>
        <ul>
          {parsedObras.map((o, i) => (
            <li key={i} style={{ color: o.available ? 'green' : 'black' }}>
              {o.name} ({o.year}){o.available && ' (Disponible para descargar)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BiographyList = ({ school }) => {
  const [bios, setBios] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(5);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadCSV('biographies').then(data => {
      const filtered = data.filter(b => b['Escuela'].split(';').map(s => s.trim()).includes(school));
      setBios(filtered);
    });
  }, [school]);

  const fuse = new Fuse(bios, { keys: ['Autor (Nombre y Apellido)', 'Biografía', 'Tema'] });
  const results = search ? fuse.search(search).map(r => r.item) : bios;
  const showResults = results.slice(0, visible);

  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por autor, tema..." className="mb-4 block w-full p-2 border" />
      <div className="grid gap-4">
        {showResults.map(b => <BiographyCard key={b['Autor (Nombre y Apellido)']} bio={b} onClick={() => setSelected(b)} />)}
      </div>
      <div className="mt-4">
        {visible < results.length && <button onClick={() => setVisible(v => v + 5)} className="mr-2">Mostrar más</button>}
        {visible > 5 && <button onClick={() => setVisible(5)}>Mostrar menos</button>}
      </div>
      {selected && <BiographyDetail bio={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default BiographyList;