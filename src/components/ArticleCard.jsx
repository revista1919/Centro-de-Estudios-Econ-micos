const ArticleCard = ({ article, onClick }) => (
  <div className="border p-4 cursor-pointer hover:bg-gray-100" onClick={onClick}>
    <h3 className="text-lg font-bold">{article['Título']}</h3>
    <p>{article['Subtítulo (si aplica)']}</p>
    <p>Por {article['Nombre']} {article['Apellido']}</p>
    <p className="text-sm text-gray-600">Explora este artículo fascinante y enriquece tu conocimiento.</p>
  </div>
);

export default ArticleCard;