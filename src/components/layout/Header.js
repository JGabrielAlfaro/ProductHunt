import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Link from "next/link";
import { useContext } from "react";
import { FirebaseContext } from "../../firebase";

const Header = () => {
  const { usuario, firebase } = useContext(FirebaseContext);

  const cambiaColorBoton = (e) => (e ? "btn blanco" : "btn rojo");

  return (
    <header className="linea">
      <div className="contenedor-header">
        <div className="alinearHeaderIzquierda">
          <Link href={"/"}>
            <p className="logo">P</p>
          </Link>
          <Buscar />

          <Navegacion />
        </div>

        <div className="alinearHeaderDerecha">
          {usuario ? (
            <>
              <p className="parrafo-sesion"> Hola: {usuario.displayName} </p>
              <button
                type="button"
                onClick={() => firebase.cerrarSesion()}
                className={cambiaColorBoton(true)}
              >
                Cerrar Sesion
              </button>
            </>
          ) : (
            <>
              <Link href={"/login"}>
                <span className={cambiaColorBoton(true)}>Login</span>
              </Link>
              <Link href={"/crear-cuenta"}>
                <span className={cambiaColorBoton(usuario)}>Crear Cuenta</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
