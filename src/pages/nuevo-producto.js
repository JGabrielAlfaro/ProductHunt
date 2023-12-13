import {useContext } from 'react'
import Layout from "@/components/layout/Layout";
import useValidacion from '../hooks/useValidacion' //hooks
import validarCrearProducto from "@/helpers/validarCrearProducto"; //helpers
import {FirebaseContext} from "../firebase"; //importa todo lo del index.js
import { useState } from "react";
import Router,{useRouter} from "next/router"; //metodos para redicionar el usuario.
import { collection , addDoc} from 'firebase/firestore';
import Error_404 from '../components/layout/404';
import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  url: '',
  imagen: '',
  descripcion:''
};


export default function NuevoProducto() {


    // States para la subida de la imagen
    const [uploading, setUploading] = useState(false);
    const [urlimagen, setURLImage] = useState('');


  const { showToast,showToastPromise  } = useContext(FirebaseContext);

  const [error,setError] = useState('');

  const { valores,errores,submitForm,handleSubmit,handleChange,handleBlur} = useValidacion(STATE_INICIAL,validarCrearProducto,crearProducto);
  const {nombre,empresa,url,descripcion} = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  // Context con las operaciones crud de firebse
  const {usuario,firebase} = useContext(FirebaseContext);

  //  console.log(usuario.uid)

  // Creando un producto
  async function crearProducto(){

    //Si el usuario no esta autenticado llevar al login
    if(!usuario){
      return router.push('/login')
    }
    //Crear el objeto de nuevo prouducto

    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos:0,
      comentarios:[],
      creado: Date.now(),
      creador: {
        id:usuario.uid,
        nombre: usuario.displayName
      },
      haVotado:[]
    }

    //Insertarlo en la base de datos.
    try {

       await addDoc(collection(firebase.db,"productos"), producto);
      // console.log(usuario)
      await showToast("Se agrego un producto correctamente","ok")
        await Router.push('/')
    } catch (error) {
       // console.error('Hubo un error al crear el usuario',error.message)
       setError(error.message)
       await showToast("Error al agregar un producto","error")
    }
    
  }

  const handleImageUpload = e => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    
    const file = e.target.files[0];
    handleChange(e);

    const imageRef = ref(firebase.storage, 'productos/' + file.name);

    // Se inicia la subida
    setUploading(true);
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed', 
        // Muestra progreso de la subida
        snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Subiendo imagen: ${progress}% terminado`);
        },
        // En caso de error
        error => {
            setUploading(false);
            console.error(error);
        },
        // Subida finalizada correctamente
        () => {
            setUploading(false);
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                console.log('Imagen disponible en:', url);
                setURLImage(url);
            });
        }
    );
};

  return (
    <div>
      <Layout>
        {
          !usuario ? <Error_404/> : (
            <>
            
                <form 
                  className="formularioCrearCuenta"
                  onSubmit={handleSubmit}
                  noValidate
                  autoComplete="off"
                >
                    <h1>Nuevo Producto</h1>
                    <fieldset>
                        <legend>Información General</legend>
                    
                        {/* NOMBRE PRODUCTO */}
                        {errores.nombre && (showToast(errores.nombre,"error") , errores.nombre = '') }
                        <div className="campo">
                            <label htmlFor="nombre">Nombre</label>
                            <input 
                              type="text" 
                              id="nombre" 
                              name="nombre"
                              placeholder="Nombre del Producto" 
                              value={nombre}
                              onChange={handleChange}
                              // onBlur={handleBlur}
                            />
                        </div>

                        {/* EMPRESA */}
                        {errores.empresa && (showToast(errores.empresa,"error") , errores.empresa = '') }
                        <div className="campo">
                            <label htmlFor="empresa">Empresa</label>
                            <input 
                              type="text" 
                              id="empresa" 
                              name="empresa"
                              placeholder="Nombre empresa o compañia" 
                              value={empresa}
                              onChange={handleChange}
                              // onBlur={handleBlur}
                            />
                        </div>

                        {/* IMPORTAR IMAGEN */}
                        {errores.imagen && (showToast(errores.imagen,"error") , errores.imagen = '') }
                        <div className="campo">
                            <label htmlFor="imagen">Imagen</label>
                            <input
                                accept="image/*"
                                type="file"
                                id="imagen"
                                name="imagen"
                                onChange={handleImageUpload}
                            />
                        </div>
      
                        {/* URL */}
                        {errores.url && (showToast(errores.url,"error") , errores.url = '') }
                        <div className="campo">
                            <label htmlFor="url">URL</label>
                            <input 
                              type="text" 
                              id="url" 
                              name="url"
                              placeholder='URL de tu producto'
                              value={url}
                              onChange={handleChange}
                              // onBlur={handleBlur}
                            />
                        </div>

                    </fieldset>

                    <fieldset>
                      <legend>Sobre tu Producto</legend>

                        {/* URL */}
                        {errores.descripcion && (showToast(errores.descripcion,"error") , errores.descripcion = '') }
                        <div className="campo">
                            <label htmlFor="empresa">Descripcion</label>
                            <textarea 
                              id="descripcion" 
                              name="descripcion"
                              value={descripcion}
                              onChange={handleChange}
                              // onBlur={handleBlur}
                            />
                        </div>

                    </fieldset>

                    <input type="submit" value={"Crear Producto"} className="InputSubmit"/>
                </form>
            </>
          )
        }
        
      </Layout>
    </div>
  )
}
