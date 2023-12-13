import React,{useEffect,useState} from "react";

import firebase from "../firebase";

function useAutenticacion (){
    const [login,setLogin] = useState(null)

    useEffect(()=>{
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario =>{
            if (usuario){
                setLogin(usuario)
            }else {
                setLogin(null)
            }
        });
        return ()=> unsuscribe();
    },[])
    return login;
}

export default useAutenticacion;