import { Link } from "react-router-dom";

const schoolLinks = [
  { path: "austrian", label: "Escuela Austríaca" },
  { path: "marxist", label: "Escuela Marxista" },
  { path: "neoclassical", label: "Escuela Neoclásica" },
  { path: "keynesian", label: "Escuela Keynesiana" },
  { path: "behavioral", label: "Escuela Conductual" },
  { path: "postkeynesian", label: "Escuela Postkeynesiana" },
  { path: "monetarist", label: "Escuela Monetarista" },
  { path: "institutionalist", label: "Escuela Institucionalista" },
];

const Navbar = () => {
  return (
    <nav className="bg-[#4b3621] border-b border-[#3e2f2a]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3 md:py-4">
        {/* Logo a la izquierda */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Logo Centro"
            className="w-20 h-20 md:w-28 md:h-28 object-contain"
          />
        </Link>

        {/* Bloque de título y selección de escuelas */}
        <div className="flex-1 md:ml-4 mt-2 md:mt-0 flex flex-col md:flex-row items-start md:items-center justify-between w-full">
          {/* Título */}
          <h1 className="font-serif font-bold text-xl md:text-2xl text-[#f5e6c2] mb-2 md:mb-0">
            Centro de Pensamiento Económico
          </h1>

          {/* Bloque de selección de escuelas */}
          <div className="bg-[#d9b382] px-3 py-2 rounded-md shadow-inner w-full md:w-auto mt-2 md:mt-0">
            <ul className="flex flex-wrap justify-start md:justify-end space-x-2 md:space-x-4 text-sm md:text-base">
              {schoolLinks.map((s) => (
                <li key={s.path}>
                  <Link
                    to={`/${s.path}`}
                    className="text-[#4b3621] hover:text-[#f5e6c2] hover:underline transition-colors duration-200 font-medium"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
