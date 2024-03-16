import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDOX8AJf5JVWVB39jU3JkfcgGwWAC1Iokw",
  authDomain: "kriyeta-2.firebaseapp.com",
  databaseURL: "https://kriyeta-2-default-rtdb.firebaseio.com",
  projectId: "kriyeta-2",
  storageBucket: "kriyeta-2.appspot.com",
  messagingSenderId: "23751741196",
  appId: "1:23751741196:web:803bda8159e9562ccc0329"
};


export const app = initializeApp(firebaseConfig);