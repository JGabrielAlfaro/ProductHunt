/* eslint-disable react-hooks/exhaustive-deps */

import {useState,useEffect} from 'react'


 const useValidacion = (stateInicial, validar, fn) => {



    const [valores,setValores] = useState(stateInicial);
    const [errores,setErrores] = useState({})
    const [submitForm,setSubmitForm] = useState(false);
  
    useEffect( () => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0; //Object.keys se utiliza para validar si un objeto esta vacio.

            if (noErrores){
                fn(); //Fn, es igual a la funcion que se ejecuta en el componente.
            }
            setSubmitForm(false)
        }
    }, [errores]);

    //Función que se ejecuta con forme el usuario escribe algo.

    const handleChange = (e)=> {
        setValores({ ...valores, [e.target.name] : e.target.value })
        // console.log(valores)
    }

    //Función que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion)
        setSubmitForm(true)
    }

    //Cuando se realiza el evento blur, es cuando el usuario se sale del campo input.
    const handleBlur = (e) => {
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion)
    }

  return {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur
  }
}

export default useValidacion;
