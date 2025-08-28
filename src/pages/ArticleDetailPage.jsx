import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { loadCSV } from '../services/csvLoader.js';

// Nueva función más robusta para fechas
const safeFormatDate = (dateStr = '') => {
  if (!dateStr) return 'n.d.';
  let date;

  // Intenta varios formatos
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    date = new Date(dateStr); // formato ISO YYYY-MM-DD
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('/');
    date = new Date(`${y}-${m}-${d}`);
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [m, d, y] = dateStr.split('-');
    date = new Date(`${y}-${m}-${d}`);
  } else {
    date = new Date(dateStr); // fallback
  }

  if (isNaN(date)) return dateStr; // si no parsea, devuelve original
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const parseText = (text = '') => {
  // cursiva entre /.../
  text = text.replace(/\/([^/]+)\//g, '<i>$1</i>');
  // negrita entre *...*
  text = text.replace(/\*([^*]+)\*/g, '<b>$1</b>');
  // links
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  return text;
};

const parseContent = (content = '') => {
  const paragraphs = content.split('===').map(p => p.trim());
  return paragraphs.map((p, i) => {
    p = parseText(p);
    p = p.replace(/\((\d+)\)/g, '<sup><a href="#note$1">$1</a></sup>');
    return (
      <p
        key={i}
        dangerouslySetInnerHTML={{ __html: p }}
        className="content text-justify leading-relaxed my-2"
      />
    );
  });
};

const parseNotes = (notes = '') => {
  if (!notes) return null;
  return notes.split(';').map((i, idx) => {
    const match = i.match(/\(\d+\) (.*)/);
    if (match) {
      const num = i.match(/\d+/)[0];
      const text = parseText(match[1]);
      return (
        <div
          key={idx}
          id={`note${num}`}
          dangerouslySetInnerHTML={{ __html: `(${num}) ${text}` }}
          className="text-sm text-justify my-1"
        />
      );
    }
  });
};

const parseReferences = (refs = '') => {
  if (!refs) return null;
  return (
    <ul className="list-disc list-inside space-y-1 text-justify">
      {refs.split(';').map((i, idx) => {
        const match = i.match(/\(\d+\) (.*)/);
        if (match) {
          const text = parseText(match[1]);
          return (
            <li
              key={idx}
              dangerouslySetInnerHTML={{ __html: text }}
              className="text-sm"
            />
          );
        }
      })}
    </ul>
  );
};

// citas limpias, sin barras
const generateCitation = (article, style) => {
  const author = `${article['Apellido'] || ''}, ${article['Nombre'] || ''}`.trim();
  const year = safeFormatDate(article['Fecha de publicación'] || '').split(' ')[2] || 'n.d.';
  const title = article['Título'] || '';
  const site = 'Centro de Pensamiento Económico';

  if (style === 'APA') {
    return `${author} (${year}). <i>${title}</i>. ${site}.`;
  }
  if (style === 'Chicago') {
    return `${author}. "<i>${title}</i>." ${site}, ${year}.`;
  }
  if (style === 'MLA') {
    return `${author}. "<i>${title}</i>." ${site}, ${year}.`;
  }
};

const ArticleDetailPage = () => {
  const { school, title } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [authorBio, setAuthorBio] = useState(null);
  const [showBio, setShowBio] = useState(false);
  const [citationStyle, setCitationStyle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    loadCSV('articles')
      .then(data => {
        const decodedTitle = decodeURIComponent(title).trim();
        const found = data.find(
          a => a['Título']?.trim().toLowerCase() === decodedTitle.toLowerCase()
        );
        if (!found) throw new Error('Artículo no encontrado');
        setArticle(found);
        return Promise.all([loadCSV('authors'), loadCSV('biographies')]);
      })
      .then(([authors, bios]) => {
        if (!article) return;
        const fullName = `${article['Nombre'] || ''} ${article['Apellido'] || ''}`.trim();
        let bio = bios.find(b => b['Autor (Nombre y Apellido)']?.trim() === fullName);
        if (!bio) {
          bio = authors.find(
            a => (a['Nombre'] + ' ' + a['Apellidos'])?.trim() === fullName
          );
          if (bio) bio.Biografía = bio['Descripción'] || '';
        }
        setAuthorBio(bio);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [title]);

  const handleDownload = () => {
    if (!article) return;
    const element = document.getElementById('article-content');
    const opt = {
      margin: [10, 20, 10, 20],
      filename: `${article['Título']}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleAuthorClick = () => {
    if (authorBio && authorBio['Biografía']) setShowBio(true);
    else alert('No hay datos de su descripción');
  };

  if (loading) return <p className="text-center">Cargando artículo...</p>;
  if (error) return <p className="text-center">Error: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (!article) return <p className="text-center">Artículo no encontrado.</p>;

  return (
    <div className="detail-page flex justify-center px-4">
      <div className="w-full max-w-3xl border p-6 bg-white shadow-md">
        <button
          onClick={() => navigate(`/${school}`)}
          className="mb-4 bg-blue-500 text-white p-2 rounded"
        >
          Volver
        </button>

        <div id="article-content" className="text-justify">
          <h1 className="text-2xl font-bold text-center mb-2">{article['Título']}</h1>
          <h2 className="text-xl text-center mb-4">{article['Subtítulo (si aplica)']}</h2>
          <p className="text-center">
            Por{' '}
            <span
              className="cursor-pointer text-blue-500"
              onClick={handleAuthorClick}
            >
              {article['Nombre']} {article['Apellido']}
            </span>
          </p>
          <p className="text-center mb-6">
            Publicado el {safeFormatDate(article['Fecha de publicación'])}
          </p>

          {parseContent(article['Contenido'])}

          <h3 className="mt-6 font-semibold">Notas al Pie</h3>
          {parseNotes(article['Notas al Pie'])}

          <h3 className="mt-6 font-semibold">Referencias</h3>
          {parseReferences(article['Referencias'])}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <button onClick={handleDownload} className="bg-blue-500 text-white p-2 rounded">
            Descargar
          </button>
          <button onClick={() => setCitationStyle('APA')} className="bg-blue-500 text-white p-2 rounded">
            Citar APA
          </button>
          <button onClick={() => setCitationStyle('Chicago')} className="bg-blue-500 text-white p-2 rounded">
            Citar Chicago
          </button>
          <button onClick={() => setCitationStyle('MLA')} className="bg-blue-500 text-white p-2 rounded">
            Citar MLA
          </button>
        </div>

        {citationStyle && (
          <p className="mt-4 text-center italic">
            {generateCitation(article, citationStyle)}
          </p>
        )}

        {showBio && authorBio && (
          <div className="mt-6 border p-4 rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Descripción del Autor</h4>
            <p className="text-justify">{authorBio['Biografía']}</p>
            <button
              onClick={() => setShowBio(false)}
              className="mt-4 bg-gray-500 text-white p-2 rounded"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
