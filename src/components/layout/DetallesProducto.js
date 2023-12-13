import Image from 'next/image'
import formatDistanceToNow  from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'
import Link from "next/link";

const DetallesProducto = ({producto}) => {
    // console.log(producto)
    const {id,comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos}= producto
  return (
    <div>

        <li className='myLi'>

              {/* IMAGEN Y DETALLE */}
            <div className='DescripcionProducto'>

                {/* IMAGEN */}
                <div>
                        <Image src={urlimagen} alt={nombre} width={200} height={200} />
                </div>

                {/* CUERPO */}
                <div>
                        <Link href={`/productos/${id}`}>
                            <h1 className='titulo'>{nombre}</h1>
                        </Link>
                        <p className='textoDescripcion'>{descripcion}</p>

                        <div className='comentario'>
                            <div>
                                <Image src="/public/static/img/comentario.png" alt={"Imagen comentario.png"} width={50} height={50} />
                                <p>{comentarios.length} Comentarios</p>
                            </div>
                        </div>

                        <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale:es})}</p>
                </div>

            </div>

             {/* VOTOS */}
            <div className='votos'>
                <div>
                    &#9650;
                    <p>{votos}</p>
                </div> 
            </div>


        </li>

    </div>
  )
}

export default DetallesProducto
