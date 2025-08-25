import { Link } from 'react-router-dom';

const SchoolCard = ({ path, label, description }) => (
  <div className="border p-4">
    <h3 className="text-lg font-bold">{label}</h3>
    <p>{description}</p>
    <Link to={`/${path}` } className="text-blue-500">Ver más</Link>
  </div>
);

export default SchoolCard;