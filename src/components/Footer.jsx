const Footer = () => {
  const adjustFont = (size) => {
    document.querySelectorAll('.content').forEach(el => el.style.fontSize = size + 'pt');
  };

  return (
    <footer className="bg-gray-800 p-4 text-white text-center">
      <p>© 2025 Centro de Pensamiento Económico. Todos los derechos reservados.</p>
      <div>
        Tamaño de letra: <button onClick={() => adjustFont(10)}>-</button> <button onClick={() => adjustFont(12)}>Reset</button> <button onClick={() => adjustFont(14)}>+</button>
      </div>
    </footer>
  );
};

export default Footer;