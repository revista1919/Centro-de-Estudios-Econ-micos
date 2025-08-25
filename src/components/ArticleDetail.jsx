import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { loadCSV } from '../services/csvLoader.js';
import formatDate from '../utils/formatDate.js';

const parseText = (text) => {
  text = text.replace(/\/([^/]+)\//g, '<i>$1</i>');
  text = text.replace(/\*([^*]+)\*/g, '<b>$1</b>');
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  return text;
};

const parseContent = (content) => {
  const paragraphs = content.split('===').map(p => p.trim());
  return paragraphs.map((p, i) => {
    p = parseText(p);
    p = p.replace(/\((\d+)\)/g, '<sup><a href="#note$1">$1</a></sup>');
    return <p key={i} dangerouslySetInnerHTML={{__html: p}} className="content" />;
  });
};

const parseNotes = (notes) => {
  if (!notes) return null;
  return notes.split(';').map((i, idx) => {
    const match = i.match(/\(\d+\) (.*)/);
    if (match) {
      const num = i.match(/\d+/)[0];
      const text = parseText(match[1]);
      return <div key={idx} id={`note${num}`} dangerouslySetInnerHTML={{__html: `(${num}) ${text}`}} className="text-sm" />;
    }
  });
};

const parseReferences = (refs) => {
  if (!refs) return null;
  return <ul>{refs.split(';').map((i, idx) => {
    const match = i.match(/\(\d+\) (.*)/);
    if (match) {
      const text = parseText(match[1]);
      return <li key={idx} dangerouslySetInnerHTML={{__html: text}} className="text-sm" />;
    }
  })}</ul>;
};

const generateCitation = (article, style) => {
  const author = `${article['Apellido']}, ${article['Nombre']}`;
  const year = formatDate(article['Fecha de publicación']).split('/')[2];
  const title = article['Título'];
  const site = 'Centro de Pensamiento Económico';
  if (style === 'APA') {
    return `${author} (${year}). /${title}/. ${site}.`;
  } if (style === 'Chicago') {
    return `${author}. "${title}." ${site}, ${year}.`;
  } if (style === 'MLA') {
    return `${author}. "${title}." ${site}, ${year}.`;
  }
};

const ArticleDetail = ({ article, onClose, school }) => {
  const [authorBio, setAuthorBio] = useState(null);
  const [showBio, setShowBio] = useState(false);
  const [citationStyle, setCitationStyle] = useState(null);

  useEffect(() => {
    Promise.all([loadCSV('authors'), loadCSV('biographies')]).then(([authors, bios]) => {
      const fullName = `${article['Nombre']} ${article['Apellido']}`;
      let bio = bios.find(b => b['Autor (Nombre y Apellido)'] === fullName);
      if (!bio) {
        bio = authors.find(a => a['Nombre'] + ' ' + a['Apellidos'] === fullName);
        if (bio) {
          bio.Biografía = bio['Descripción'];
          bio.Foto = bio['Foto'];
        }
      }
      setAuthorBio(bio);
    });
  }, [article]);

  const handleDownload = () => {
    const element = document.getElementById('article-content');
    html2pdf().from(element).save(`${article['Título']}.pdf`);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Cerrar</button>
        <div id="article-content">
          <h1 className="text-2xl font-bold">{article['Título']}</h1>
          <h2 className="text-xl">{article['Subtítulo (si aplica)']}</h2>
          <p>Por <span className="cursor-pointer text-blue-500" onClick={() => setShowBio(true)}>{article['Nombre']} {article['Apellido']}</span></p>
          <p>Publicado el {formatDate(article['Fecha de publicación'])}</p>
          {parseContent(article['Contenido'])}
          <h3>Notas al Pie</h3>
          {parseNotes(article['Notas al Pie'])}
          <h3>Referencias</h3>
          {parseReferences(article['Referencias'])}
        </div>
        <button onClick={handleDownload} className="mt-4">Descargar</button>
        <button onClick={() => setCitationStyle('APA')} className="ml-2">Citar APA</button>
        <button onClick={() => setCitationStyle('Chicago')} className="ml-2">Citar Chicago</button>
        <button onClick={() => setCitationStyle('MLA')} className="ml-2">Citar MLA</button>
        {citationStyle && <p className="mt-2">{generateCitation(article, citationStyle)}</p>}
        {showBio && authorBio && (
          <div className="mt-4 border p-4">
            <h4>Biografía del Autor</h4>
            <img src={authorBio.Foto} alt="Foto" className="w-32" />
            <p>{authorBio.Biografía}</p>
            <button onClick={() => setShowBio(false)}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;