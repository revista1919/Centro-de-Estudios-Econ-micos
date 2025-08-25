import { useState } from 'react';

const schools = [
  "Escuela de Economía",
  "Escuela de Administración",
  "Escuela de Finanzas"
];

function SchoolSelector({ onSelect }) {
  const [selected, setSelected] = useState(schools[0]);

  const handleChange = (e) => {
    setSelected(e.target.value);
    if (onSelect) onSelect(e.target.value);
  };

  return (
    <select value={selected} onChange={handleChange} className="mb-4 p-2 border">
      {schools.map(school => (
        <option key={school} value={school}>{school}</option>
      ))}
    </select>
  );
}

export default SchoolSelector;