import Link from "next/link"

import { useContext } from "react"
import { FirebaseContext } from "@/firebase"

const Navegacion = () => {

  const {usuario} = useContext(FirebaseContext);

  return (
    <nav className="navegacion">
       <Link href={"/"} className="enlace">Inicio</Link>
       <Link href={"/populares"} className="enlace">Populares</Link>
       {
        usuario && (
          <Link href={"/nuevo-producto"} className="enlace">Nuevo producto</Link>
        )
       }
       
    </nav>
  )
}

export default Navegacion
