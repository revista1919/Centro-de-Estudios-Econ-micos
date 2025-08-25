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
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
        {/* Logo / Título */}
        <Link
          to="/"
          className="font-serif font-bold text-xl md:text-2xl text-[#f5f1eb] mb-2 md:mb-0"
        >
          Centro de Pensamiento Económico
        </Link>

        {/* Bloque de selección de escuelas */}
        <div className="bg-[#d9b382] px-4 py-2 rounded-md shadow-inner w-full md:w-auto mt-2 md:mt-0">
          <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
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
    </nav>
  );
};

export default Navbar;
