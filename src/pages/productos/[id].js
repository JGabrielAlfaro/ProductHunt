import { useRouter } from "next/router"
import { useEffect,useContext,useState } from "react";
import { FirebaseContext } from "@/firebase";

import {collection, getDoc, doc,setDoc,updateDoc,deleteDoc ,increment} from 'firebase/firestore'
import { getStorage, ref, deleteObject } from "firebase/storage"
import Layout from "@/components/layout/Layout";
import Error_404 from "@/components/layout/404";
import Image from 'next/image'
import Link from "next/link";
//Formatear la fecha 
import formatDistanceToNow  from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'



export default function Producto({ params }) {

    //state del componente
    const [producto, setProducto]= useState({})
    const [error,setError] = useState(false);
    const [comentario,setComentario] = useState({})
    const [consultarDB,setConsultarDB] = useState(true)

    //Rounting para obtener el ID actual
    const router = useRouter();
    //console.log(router.query.id);
    const {query: {id}} = router;


    //Context de firebase
    const {firebase,usuario,showToastPromise} = useContext(FirebaseContext);


    const cambiaColorBoton = (e) => (e ? "btn blanco" : "btn rojo");

    useEffect(() => {
      if(id && consultarDB){
        const obtenerProducto = async ()=>{
            const productoQuery = await doc(collection(firebase.db, 'productos'), id);             
            const productoID = await  getDoc(productoQuery);
            // console.log(productoID)
            // console.log(productoID.data());  

            if(productoID.exists && typeof(productoID.data()) !== 'undefined'){
              setProducto(productoID.data());
              setConsultarDB(false)
                 //Aqui puede ir un spinner
                if (Object.keys(producto).length === 0 ) return 'Cargando...';
            }else{
              setError(true);
              setConsultarDB(false)
            }
        }
        obtenerProducto();
      }
    }, [id]);


  const {comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos,creador,haVotado} = producto;

  //Administrar y validar los votos.
  const votarProducto = async () =>{
    // console.log('Botando')
    if (!usuario){
      return router.push('/login')
    }

    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos +1;

    //Verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    //Guardar el ID del usuario del usuario ha votado
    const nuevoHaVotado = [...haVotado,usuario.uid]


    //Actualizar en la base de datos
    const docRef = await doc(collection(firebase.db, 'productos'), id);              
    await updateDoc(docRef, {
                              votos: increment(nuevoTotal),
                              haVotado:nuevoHaVotado 
                            }
                    );
    //Actualizar en el state
    setProducto({
      ...producto,
      votos: nuevoTotal
    })
    setConsultarDB(true) // hay un voto entonces consultar a la base de datos.

  }

  //Funciones para crear comentarios
  const comentarioChange = e => {
   

    setComentario({
      ...comentario,
      [e.target.name] : e.target.value
    })

    // console.log(comentario)
  }

  // Identifica si el comentario es del creador del producto.
  const esCreador = id => {
    if (creador.id === id){
      return true;
    }

  }

  const agregarComentario = async (e) => {
    e.preventDefault();


    if (!usuario){
      return router.push('/login')
    }
    
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //Tomar copia de comentario y agregarlo al arreglo
    const nuevoComentarios = [...comentarios,comentario]

    //Actualizar la BD
    const docRef = await doc(collection(firebase.db, 'productos'), id);              
    await updateDoc(docRef, { comentarios: nuevoComentarios });
                             
    //Actualizar el State
    setProducto({
      ...producto,
      comentarios: nuevoComentarios
    })
    setConsultarDB(true) // hay un comentario entonces consultar a la base de datos.
  }

  //Función que revisa que el creador del producto sea el mimismo que esta autentificado.

  const puedeBorrar =() => {

    if (!usuario) return false;

    // console.log(creador)
    if (creador?.id === usuario.uid) {
      return true;
    }
  }

  //Eliminar un producto de la base de datos.
  const eliminarProducto = async  () => {

    if (!usuario){
      return router.push('/login')
    }

    if (creador?.id !== usuario.uid) {
      return router.push('/');
    }

    try {
       // Eliminar Producto
       await deleteDoc(doc(firebase.db, "productos", id))
       // Eliminar imagen
       const storage = getStorage()
       const imgRef = ref(storage, urlimagen)
       deleteObject(imgRef)
       await showToastPromise("Se elimino el producto correctamente","ok")
       router.push("/")

    } catch (error) {
        console.log(error);
    }

  }

  return (
    <Layout>
      <>
        { error ? <Error_404 />: (
            <div className="contenedor producto">
                <h1>{nombre}</h1>
                <div className="contenedor-producto">
                    {/* SECCION COMENTARIO */}
                    <div>
                      {
                        creado && 
                          <>
                            <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale:es})} </p>
                            <p>Por: {creador?.nombre} de {empresa}</p>
                            <Image src={urlimagen} alt={nombre} width={600} height={600} />
                            <p>{descripcion}</p>
                          {
                              usuario && (
                                <>
                                    <h2>Agregar tu comentario</h2>
                                    <form onSubmit={agregarComentario}>
                                        <div className="campo">
                                          <input  type="text" name="mensaje" onChange={comentarioChange}/>
                                        </div>
                                        <input type="submit" value={"Agregar Comentario"} className="InputSubmit"/>
                                    </form>
                                </>
                              )
                          } 
                            <h2 className="productoH2">Comentarios</h2>
                            {comentarios.length === 0 ? 'Aún no hay comentarios' : (
                                <ul>
                                    { comentarios.map ( (c,i) => (
                                        <li key={`${c.usuarioId}-${i}`} className="borderLi">
                                          <p>{c.mensaje}</p>
                                          <p>Escrito por: 
                                            <span
                                              className="idSpan"
                                            >
                                              {' '} {c.usuarioNombre}
                                            </span>
                                          </p>
                                          {esCreador(c.usuarioId) && <p className="creadorProducto"> Es Creador </p>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                          </> 
                      }
                    
                      
                    </div>

                    {/* SECCION SIDEBAR */}
                    <aside>

                        {
                            creado && 
                              <div>
                                <Link href={url} target="_blank">
                                    <span className={cambiaColorBoton(true)}>Visitar URL</span>
                                </Link>
                                
                                <p className="productoParrafo">{votos} Votos</p>

                                {
                                  usuario && (
                            
                                        < button
                                          onClick={votarProducto}
                                          className={cambiaColorBoton(false)}
                                        >
                                            Votar
                                        </button>
                                
                                  )
                                }
                               
                              </div>
                        }
                    </aside>
                    { puedeBorrar() && 
                      <button
                      onClick={eliminarProducto}
                      >Eliminar Producto</button>
                    }
                </div>
            </div>
        )}
      </>
    </Layout>
  )
}


