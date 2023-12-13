//Librerias de caja.
import { useState } from "react";
import Router from "next/router"; //metodos para redicionar el usuario.

//Firebase y useContext para firebase
import firebase,{FirebaseContext} from "../firebase"; //importa todo lo del index.js
import {useContext } from 'react'

//Validaciones
import useValidacion from '../hooks/useValidacion' //hooks
import validarIniciarSesion from "@/helpers/validarIniciarSesion"; //helpers

//Layout
import Layout from "@/components/layout/Layout";


const STATE_INICIAL = {
  email: '',
  password: ''
};

export default function Login() {

  const { showToast,showToastPromise  } = useContext(FirebaseContext);

  const [error,setError] = useState('');

  const { valores,errores,handleSubmit,handleChange} = useValidacion(STATE_INICIAL,validarIniciarSesion,iniciarSesion);
  const {email,password} = valores;

  // console.log("email",email)
  // console.log("password",password)
  
  async function iniciarSesion(){
    try {
      const usuario = await firebase.login(email, password)
      // console.log(usuario)
      await showToastPromise("Iniciando sesión","ok")
      await Router.push('/')
    } catch (error) {
       // console.error('Hubo un error al crear el usuario',error.message)
       setError(error.message)
       await showToast("Valide su correo y password para continuar","error")
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
              autoComplete="false"
            >
                <h1>Iniciar Sesion</h1>

                {errores.email && (showToast(errores.email,"error") , errores.email = '') }

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
                      autoComplete="false"
                      // onBlur={handleBlur}
                    />
                </div>
                { errores.password && (showToast(errores.password,"error") , errores.password = '') }
                
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
                      autoComplete="false"
                    />
                </div>

                <input type="submit" value={"Iniciar Sesión"} className="InputSubmit"/>
            </form>
        </>
      </Layout>
    </div>
  )
}
