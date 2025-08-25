import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCSV } from '../services/csvLoader.js';

const BiographyDetailPage = () => {
  const { school, author } = useParams();
  const navigate = useNavigate();
  const [bio, setBio] = useState(null);
  const [books, setBooks] = useState([]);
  const [parsedObras, setParsedObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    loadCSV('biographies')
      .then(data => {
        const found = data.find(b => b['Autor (Nombre y Apellido)'] === decodeURIComponent(author));
        if (!found) throw new Error('Biografía no encontrada');
        setBio(found);
        return loadCSV('books');
      })
      .then(data => {
        setBooks(data);
        const obras = bio['Obras clave (Nombre del libro, Año)']?.split(';').map(o => o.trim()) || [];
        const parsed = obras.map(o => {
          const [name, year] = o.split(',');
          const available = data.some(b => b['Título'] === name?.trim());
          return { name: name?.trim(), year: year ? year.trim() : '', available };
        });
        setParsedObras(parsed);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [author]);

  if (loading) return <p>Cargando biografía...</p>;
  if (error) return <p>Error: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (!bio) return <p>Biografía no encontrada.</p>;

  return (
    <div className="detail-page">
      <button onClick={() => navigate(`/${school}`)} className="mb-4 bg-blue-500 text-white p-2 rounded">Volver</button>
      <img src={bio['Foto'] || '/placeholder.jpg'} alt="Foto" className="w-48 mb-4" />
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
  );
};

export default BiographyDetailPage;