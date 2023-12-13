import {useContext } from 'react'
import Layout from "@/components/layout/Layout";
import useValidacion from '../hooks/useValidacion' //hooks
import validarCrearCuenta from "@/helpers/validarCrearCuenta"; //helpers
import firebase,{FirebaseContext} from "../firebase"; //importa todo lo del index.js
import { useState } from "react";
import Router from "next/router"; //metodos para redicionar el usuario.


const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
};

export default function CrearCuenta() {

  const { showToast,showToastPromise  } = useContext(FirebaseContext);

  const [error,setError] = useState('');

  const { valores,errores,submitForm,handleSubmit,handleChange,handleBlur} = useValidacion(STATE_INICIAL,validarCrearCuenta,crearCuenta);
  const {nombre,email,password} = valores;

  
  // Creando una cuenta para el aplicativo.
  async function crearCuenta (){
    try {
      await firebase.registrar(nombre,email, password)
      await showToastPromise("Se creo la cuenta correctamente","ok")
      await Router.push('/')
    } catch (error) {
      // console.error('Hubo un error al crear el usuario',error.message)
      setError(error.message)
    }
  }

  return (
    <div>
      <Layout>
        <>
            
            <form 
              className="formularioCrearCuenta"
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
            >
                <h1>Crear Cuenta</h1>
                {errores.nombre && (showToast(errores.nombre,"error") , errores.nombre = '') }
                {/* { errores.nombre && showToast(errores.nombre,"error")} */}
                
                
                {/* Campo nombre */}
                <div className="campo">
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre"
                      placeholder="Tu nombre" 
                      value={nombre}
                      onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                </div>
                {errores.email && (showToast(errores.email,"error") , errores.email = '') }
                {/* {errores.email &&  showToast(errores.email,"error")} */}
                  
                
                {/* Campo email */}
                <div className="campo">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder="Tu email" 
                      value={email}
                      onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                </div>
                { errores.password && (showToast(errores.password,"error") , errores.password = '') }
                
                {/* { error &&   showToast(error,"error") &  setError('')} */}
                  
                  
                
                 
                
                 {/* Campo Password */}
                 <div className="campo">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password"
                      placeholder="Tu password" 
                      value={password}
                      onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                </div>

                <input type="submit" value={"Crear cuenta"} className="InputSubmit"/>
            </form>
        </>
      </Layout>
    </div>
  )
}
