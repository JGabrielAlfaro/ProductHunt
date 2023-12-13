import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import DetallesProducto from "@/components/layout/DetallesProducto";
import useProductos from "@/hooks/useProductos";
import { useEffect, useState } from "react";

export default function Buscar() {



  const router = useRouter();
  // console.log(router)
  const {query:{q}} = router;
  // console.log(q)

  //  Todos los productos
  const {productos} = useProductos('creado')
  const [resultado,setResultado] = useState([]);

  // console.log(productos)

  useEffect(()=>{
    const busqueda = q.toLocaleLowerCase();

    const filtro = productos.filter(p => {
      return (
        p.nombre.toLocaleLowerCase().includes(busqueda) || p.descripcion.toLocaleLowerCase().includes(busqueda)
      )
    })
    setResultado(filtro)

  },[q,productos])


  return (
    <>
      <Layout>
           <div className="listado-productos">
              <div className="contenedor">
                  <ul className="bg-white">
                      {
                        resultado.map (p => (
                            <DetallesProducto key={p.id} producto={p}/>
                        ))
                      }
                  </ul>
              </div>
           </div>
      </Layout>

    </>
  )
}
