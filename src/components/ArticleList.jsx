import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import ArticleCard from './ArticleCard.jsx';
import { loadCSV } from '../services/csvLoader.js';

const ArticleList = ({ school }) => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    loadCSV('articles')
      .then(data => {
        const filtered = data.filter(a => a['Escuela']?.split(';').map(s => s.trim().toLowerCase()).includes(school.toLowerCase()));
        setArticles(filtered);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [school]);

  const fuse = new Fuse(articles, { keys: ['Título', 'Subtítulo (si aplica)', 'Contenido', 'Tema'], threshold: 0.3 });
  const results = search ? fuse.search(search).map(r => r.item) : articles;
  const showResults = results.slice(0, visible);

  if (loading) return <p>Cargando artículos...</p>;
  if (error) return <p>Error al cargar artículos: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (articles.length === 0) return <p>No hay artículos disponibles para esta escuela.</p>;

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por título, tema..."
        className="mb-4 block w-full p-2 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showResults.map(a => (
          <ArticleCard
            key={a['Título']}
            article={a}
            onClick={() => navigate(`/${school}/articles/${encodeURIComponent(a['Título'])}`)}
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

export default ArticleList;