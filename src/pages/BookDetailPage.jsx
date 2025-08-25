import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCSV } from '../services/csvLoader.js';
import formatDate from '../utils/formatDate.js';

const BookDetailPage = () => {
  const { school, title } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [bio, setBio] = useState(null);
  const [showBio, setShowBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    loadCSV('books')
      .then(data => {
        const found = data.find(b => b['Título'] === decodeURIComponent(title));
        if (!found) throw new Error('Libro no encontrado');
        setBook(found);
        return loadCSV('biographies');
      })
      .then(data => {
        const foundBio = data.find(b => b['Autor (Nombre y Apellido)'] === book['Autor']);
        setBio(foundBio);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [title]);

  const parseInstitutions = (inst) => {
    return inst?.split(';').map(i => {
      const match = i.match(/(.*)\((.*)\)/);
      if (match) {
        return <a key={match[2]} href={match[2]} target="_blank" className="text-blue-500">{match[1].trim()}</a>;
      }
      return <span key={i}>{i}</span>;
    }).reduce((prev, curr) => [prev, ', ', curr], []) || [];
  };

  const handleAuthorClick = () => {
    if (bio && bio['Biografía']) {
      setShowBio(true);
    } else {
      alert('No hay datos de su descripción');
    }
  };

  if (loading) return <p>Cargando libro...</p>;
  if (error) return <p>Error: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (!book) return <p>Libro no encontrado.</p>;

  return (
    <div className="detail-page">
      <button onClick={() => navigate(`/${school}`)} className="mb-4 bg-blue-500 text-white p-2 rounded">Volver</button>
      <h1 className="text-2xl font-bold">{book['Título']}</h1>
      <p>Por <span className="cursor-pointer text-blue-500" onClick={handleAuthorClick}>{book['Autor']}</span></p>
      <p>Publicado: {formatDate(book['Fecha de publicación (dd/mm/aa)'])}</p>
      <p>{book['Descripción']}</p>
      <p>Editorial: {book['Editorial']}</p>
      <p>Institución: {parseInstitutions(book['Institución que lo tiene disponible'])}</p>
      <a href={book['Link para verlo o descargarlo']} target="_blank" className="text-blue-500">Descargar o Ver</a>
      {showBio && bio && (
        <div className="mt-4 border p-4">
          <h4>Descripción del Autor</h4>
          <p>{bio['Biografía']}</p>
          <button onClick={() => setShowBio(false)} className="bg-gray-500 text-white p-2 rounded">Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;