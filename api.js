import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyAhpCsOTkfd7jW9XW_E8BoArUqvzPi3IzQ",
  authDomain: "vanlife-20871.firebaseapp.com",
  projectId: "vanlife-20871",
  storageBucket: "vanlife-20871.firebasestorage.app",
  messagingSenderId: "75445071493",
  appId: "1:75445071493:web:9ce908f62275bdb2b3c3ec",
};

// this is the web </> app we create in our firebase account
const app = initializeApp(firebaseConfig);

// getting the firestore database from the web </> we created
const db = getFirestore(app);

// a reference to the vans collection we created in our firestore database
const vansCollectionRef = collection(db, "vans");

// getting an array of vans documents
export async function getVans() {
  const snapshot = await getDocs(vansCollectionRef);

  // changing the format of the returned array
  const vans = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  // console.log(vans);
  return vans;
}

export async function getVan(id) {
  const docRef = doc(db, "vans", id);

  const snapShot = await getDoc(docRef);

  // spread the object returned by snapshot.data() into a new object. Add an id property to the new object
  const van = { ...snapShot.data(), id: snapShot.id };

  console.log(van);
  return van;
}

export async function getHostVans() {
  const q = query(vansCollectionRef, where("hostId", "==", "123"));
  const snapshot = await getDocs(q);
  const vans = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return vans;
}

// export async function getHostVans(id) {
//   const url = id ? `/api/host/vans/${id}` : "/api/host/vans";
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw {
//       message: "Failed to fetch vans",
//       statusText: res.statusText,
//       status: res.status,
//     };
//   }
//   const data = await res.json();
//   return data.vans;
// }

export async function loginUser(creds) {
  const res = await fetch("/api/login", {
    method: "post",
    body: JSON.stringify(creds),
  });
  const data = await res.json();

  if (!res.ok) {
    throw {
      message: data.message,
      statusText: res.statusText,
      status: res.status,
    };
  }

  return data;
}
