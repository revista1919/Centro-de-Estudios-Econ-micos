import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import ArticleCard from './ArticleCard.jsx';
import ArticleDetail from './ArticleDetail.jsx';
import { loadCSV } from '../services/csvLoader.js';

const ArticleList = ({ school }) => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(5);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadCSV('articles').then(data => {
      const filtered = data.filter(a => a['Escuela'].split(';').map(s => s.trim()).includes(school));
      setArticles(filtered);
    });
  }, [school]);

  const fuse = new Fuse(articles, { keys: ['Título', 'Subtítulo (si aplica)', 'Contenido', 'Tema'] });
  const results = search ? fuse.search(search).map(r => r.item) : articles;
  const showResults = results.slice(0, visible);

  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título, tema..." className="mb-4 block w-full p-2 border" />
      <div className="grid gap-4">
        {showResults.map(a => <ArticleCard key={a['Título']} article={a} onClick={() => setSelected(a)} />)}
      </div>
      <div className="mt-4">
        {visible < results.length && <button onClick={() => setVisible(v => v + 5)} className="mr-2">Mostrar más</button>}
        {visible > 5 && <button onClick={() => setVisible(5)}>Mostrar menos</button>}
      </div>
      {selected && <ArticleDetail article={selected} onClose={() => setSelected(null)} school={school} />}
    </div>
  );
};

export default ArticleList;