import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { loadCSV } from '../services/csvLoader.js';
import formatDate from '../utils/formatDate.js';

const BookCard = ({ book, onClick }) => (
  <div className="border p-4 cursor-pointer hover:bg-gray-100" onClick={onClick}>
    <h3 className="text-lg font-bold">{book['Título']}</h3>
    <p>Por {book['Autor']}</p>
    <p className="text-sm">{book['Descripción'].slice(0, 100)}...</p>
    <p className="text-sm text-gray-600">Descubre este libro esencial y descarga para tu biblioteca personal.</p>
  </div>
);

const BookDetail = ({ book, onClose }) => {
  const [bio, setBio] = useState(null);
  const [showBio, setShowBio] = useState(false);

  useEffect(() => {
    loadCSV('biographies').then(data => {
      const found = data.find(b => b['Autor (Nombre y Apellido)'] === book['Autor']);
      setBio(found);
    });
  }, [book]);

  const parseInstitutions = (inst) => {
    return inst.split(';').map(i => {
      const match = i.match(/(.*)\((.*)\)/);
      if (match) {
        return <a key={match[2]} href={match[2]} target="_blank" className="text-blue-500">{match[1].trim()}</a>;
      }
      return <span key={i}>{i}</span>;
    }).reduce((prev, curr) => [prev, ', ', curr], []);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Cerrar</button>
        <h1 className="text-2xl font-bold">{book['Título']}</h1>
        <p>Por <span className="cursor-pointer text-blue-500" onClick={() => setShowBio(true)}>{book['Autor']}</span></p>
        <p>Publicado: {formatDate(book['Fecha de publicación (dd/mm/aa)'])}</p>
        <p>{book['Descripción']}</p>
        <p>Editorial: {book['Editorial']}</p>
        <p>Institución: {parseInstitutions(book['Institución que lo tiene disponible'])}</p>
        <a href={book['Link para verlo o descargarlo']} target="_blank" className="text-blue-500">Descargar o Ver</a>
        {showBio && bio && (
          <div className="mt-4 border p-4">
            <h4>Biografía del Autor</h4>
            <img src={bio['Foto']} alt="Foto" className="w-32" />
            <p>{bio['Biografía']}</p>
            <button onClick={() => setShowBio(false)}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

const BookList = ({ school }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(5);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadCSV('books').then(data => {
      const filtered = data.filter(b => b['Escuela'].split(';').map(s => s.trim()).includes(school));
      setBooks(filtered);
    });
  }, [school]);

  const fuse = new Fuse(books, { keys: ['Título', 'Autor', 'Descripción', 'Tema'] });
  const results = search ? fuse.search(search).map(r => r.item) : books;
  const showResults = results.slice(0, visible);

  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título, autor, tema..." className="mb-4 block w-full p-2 border" />
      <div className="grid gap-4">
        {showResults.map(b => <BookCard key={b['Título']} book={b} onClick={() => setSelected(b)} />)}
      </div>
      <div className="mt-4">
        {visible < results.length && <button onClick={() => setVisible(v => v + 5)} className="mr-2">Mostrar más</button>}
        {visible > 5 && <button onClick={() => setVisible(5)}>Mostrar menos</button>}
      </div>
      {selected && <BookDetail book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default BookList;