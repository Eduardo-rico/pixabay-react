import React, { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListadoImagenes from "./components/ListadoImagenes";

function App() {
  //state de la app
  const [busqueda, guardarBusqueda] = useState("");
  const [imagenes, guardarImagenes] = useState([]);
  //paginador
  const [paginaactual, guardarPaginaactual] = useState(1);
  const [totalpaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarAPI = async () => {
      if (busqueda === "") return;
      const imagenerPorPagina = 30;
      const key = "16433542-9f0e16015e68d549d1bd38da7";
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenerPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);
      //calcular total pafigas
      const calcularTotalPaginas = Math.ceil(
        resultado.totalHits / imagenerPorPagina
      );
      //se guarda el numero total de paginas
      guardarTotalPaginas(calcularTotalPaginas);

      //mover la pantalla hacia arriba
      const jumbotron = document.querySelector(".jumbotron");
      jumbotron.scrollIntoView({ behavior: "smooth" });
    };

    consultarAPI();
  }, [busqueda, paginaactual]);

  //definir las acciones de los botones
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;
    if (nuevaPaginaActual === 0) return;
    guardarPaginaactual(nuevaPaginaActual);
  };
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;
    if (nuevaPaginaActual > totalpaginas) return;
    guardarPaginaactual(nuevaPaginaActual);
  };

  return (
    <div className='container'>
      <div className='jumbotron'>
        <p className='lead text-center'>Buscador de imagenes</p>
        <Formulario guardarBusqueda={guardarBusqueda} />
      </div>
      <div className='row justify-content-center'>
        <ListadoImagenes imagenes={imagenes} />
        {paginaactual === 1 ? null : (
          <button
            type='button'
            className='btn btn-info mr-1'
            onClick={paginaAnterior}
          >
            &laquo; Anterior
          </button>
        )}
        {paginaactual === totalpaginas ? null : (
          <button
            type='button'
            className='btn btn-info mr-1'
            onClick={paginaSiguiente}
          >
            &raquo; Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
