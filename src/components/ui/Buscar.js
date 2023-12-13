import React from 'react'
import { useState } from 'react'
import Router from 'next/router'

const Buscar = () => {

  const [busqueda, setBusqueda] = useState('')

  const buscarProducto = e => {
    e.preventDefault();
    

    if (busqueda.trim() === '') return ;
    console.log("Buscando...!!!")


    //Redireccionar el usuario.
    Router.push({
      pathname: '/buscar',
      query: {q: busqueda}
    })

    
  }

  return (
    <form className='formularioBtn' onSubmit={buscarProducto}>
      <input 
        type='text' 
        className='input-text' 
        placeholder='Buscar productos'
        onChange={e => setBusqueda(e.target.value)}
      />
      <button type='submit' className='input-submit'>Buscar</button>
    </form>
  )
}

export default Buscar
