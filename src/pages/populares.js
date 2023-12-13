import Layout from "@/components/layout/Layout";
import DetallesProducto from "@/components/layout/DetallesProducto";
import useProductos from "@/hooks/useProductos";

export default function Populares() {

  const {productos} = useProductos('votos')

  return (
    <>
      <Layout>
           <div className="listado-productos">
              <div className="contenedor">
                  <ul className="bg-white">
                      {
                        productos.map (p => (
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

