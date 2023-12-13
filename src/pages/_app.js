import App from 'next/app';
import firebase, {FirebaseContext} from '../firebase'
import useAutenticacion from '@/hooks/useAutenticacion';
import {toast } from 'react-toastify'


const MyApp = (props) => {
    const usuario = useAutenticacion();
    // console.log(usuario)
    const {Component,pageProps} = props;

    const showToastPromise = (mensaje, tipo) => {
        return new Promise((resolve) => {
          if (tipo === "ok") {
            toast.success(mensaje, {
              autoClose: 3000,
              onClose: resolve, // Llama a resolve después de que se cierre el Toast
            });
          } else {
            toast.error(mensaje, {
              autoClose: 3000,
              onClose: resolve,
            });
          }
        });
      };

      const showToast = (mensaje, tipo) => {
        setTimeout(() => {
            if (tipo === "ok") {
              toast.success(mensaje);
            } else {
              toast.error(mensaje);
            }
          }, 1000);
      };

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                showToastPromise,
                showToast,
                usuario
            }}
        >
            <Component {...pageProps} />
                
            
        </FirebaseContext.Provider>
    )
}

export default MyApp