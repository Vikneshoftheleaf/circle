"use client"
import { auth, db, storage } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const provider = new GoogleAuthProvider();
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authcontext";

export function googleSignup() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const [displayName] = user.email.split('@')
      setDoc(doc(db, "user", user.uid), {
        uid: user.uid,
        userName:null,
        descrip:null,
        displayName: user.displayName ? user.displayName : displayName[0],
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : null,
        followers: 0,
        following: 0,
        posts: 0

      });
      // IdP data available using getAdditionalUserInfo(result)
      console.log("signned up with google!")

      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage)
      // ...
    });
}

export function googleSignin() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      console.log("signned in with google!")

      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage)
      // ...
    });
}

export function emailLogin(e, email, password) {
  e.preventDefault()
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("logged in with email!")
      // ...user
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
    });

}

export function emailSignup(e, email, password) {
  e.preventDefault();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      const [displayName] = user.email.split('@')
      setDoc(doc(db, "user", user.uid), {
        uid: user.uid,
        userName:null,
        descrip:null,
        displayName: user.displayName ? user.displayName : displayName[0],
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : null,
        followers: 0,
        following: 0,
        posts: 0

      });
      console.log('siggned in with email!')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      console.log(email, password)

      // ..
    });


}

export function logOut() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("signned Out!")
  }).catch((error) => {
    // An error happened.
    console.log(error.errorMessage)
  });
}


export function createPost(image, title, tags, uid, displayName, photoURL) {
  const metadata = {
    contentType: 'image/jpeg',
  };
  const storageRef = ref(storage, `posts/${image.name}`);

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, image, metadata).then(() => {

    getDownloadURL(ref(storage, `posts/${image.name}`))
      .then(async(url) => {
        const docRef = await addDoc(collection(db, "posts"), {
          postPicURL: url,
          title: title,
          tags: tags,
          author: uid,
          likes:0,
          authorName:displayName,
          authorImg:photoURL
          
        });
        console.log("post id", docRef.id)
      })

  });






}