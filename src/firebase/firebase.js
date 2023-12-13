// import app from 'firebase/app'; // Firebase 9
import { initializeApp } from 'firebase/app'; // compatibilidad en firebase9
import { getAuth, createUserWithEmailAndPassword,updateProfile,signInWithEmailAndPassword  } from 'firebase/auth';
import firebaseConfig from './config';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


console.log("Firebase", firebaseConfig)
 const app = initializeApp(firebaseConfig);


class Firebase {
  constructor() {
    // const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  // Registrar un usuario.
  async registrar(nombre, email, password) {
    try {
      const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);

      // Utilizar updateProfile desde el módulo auth para establecer el displayName
      await updateProfile(this.auth.currentUser, { displayName: nombre });

      return nuevoUsuario;
    } catch (error) {
      // Manejar errores de registro de usuario aquí
      console.error('Error al registrar usuario:', error.message);
      throw error;
    }
  }


  // Inicia sesión del usuario
  async login(email, password) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      // Manejo de errores (puedes lanzar un mensaje de error o registrarlo)
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  // Cierra la sesión del usuario
  async cerrarSesion() {
    try {
      await this.auth.signOut();
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }


}

const firebase = new Firebase();
export default firebase;