import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCSV } from '../services/csvLoader.js';

const ScholarshipDetailPage = () => {
  const { school, name } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    loadCSV('scholarships')
      .then(data => {
        const found = data.find(s => s['Nombre de la Beca'] === decodeURIComponent(name));
        if (!found) throw new Error('Beca no encontrada');
        setScholarship(found);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [name]);

  const parseInstitutions = (inst) => {
    return inst?.split(';').map(i => {
      const match = i.match(/(.*)\((.*)\)/);
      if (match) {
        return <a key={match[2]} href={match[2]} target="_blank" className="text-blue-500">{match[1].trim()}</a>;
      }
      return <span key={i}>{i}</span>;
    }).reduce((prev, curr) => [prev, ', ', curr], []) || [];
  };

  if (loading) return <p>Cargando beca...</p>;
  if (error) return <p>Error: {error}. Por favor, intenta de nuevo más tarde.</p>;
  if (!scholarship) return <p>Beca no encontrada.</p>;

  return (
    <div className="detail-page">
      <button onClick={() => navigate(`/${school}`)} className="mb-4 bg-blue-500 text-white p-2 rounded">Volver</button>
      <img src={scholarship['Foto promocional'] || '/placeholder.jpg'} alt="Foto" className="w-full mb-4" />
      <h1 className="text-2xl font-bold">{scholarship['Nombre de la Beca']}</h1>
      <p>Monto: {scholarship['Monto (si aplica)']}</p>
      <p>Institución: {parseInstitutions(scholarship['Institución que la otorga'])}</p>
      <p>{scholarship['Descripción de la beca']}</p>
      <p>Incluye: {scholarship['Cosas que incluye']}</p>
      <a href={scholarship['Link para mas información']} target="_blank" className="text-blue-500">Más información</a>
    </div>
  );
};

export default ScholarshipDetailPage;