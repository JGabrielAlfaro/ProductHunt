import React,{ useState,useEffect,useContext } from "react";
import { FirebaseContext } from "@/firebase";
import {collection, getDocs,query, orderBy } from 'firebase/firestore'

const useProductos = (orden) => {
    const [productos,setProductos] = useState([]);
  const { firebase } = useContext(FirebaseContext)

  // useEffect( () => {
  //   const obtenerProductos = async () => {
  //     const querySnapshot = await getDocs(collection(firebase.db, "productos"));
  //     const productos = querySnapshot.docs.map(doc => {
  //       return {
  //         id: doc.id,
  //       ...doc.data()
  //     }
  //     });
  //     setProductos(productos)
  //     //  console.log(productos)
  //   }
  //   obtenerProductos()
  // }, [])

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(firebase.db, "productos"), orderBy(orden, "desc"))
        );
  
        const productos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
  
        setProductos(productos);
      } catch (error) {
        console.error("Error obteniendo productos:", error);
      }
    };
  
    obtenerProductos();
  }, []);

  return {
    productos
  }

}

export default useProductos
