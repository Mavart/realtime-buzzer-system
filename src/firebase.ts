import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "buzzer-system-demo.firebaseapp.com",
  databaseURL: "https://buzzer-system-demo-default-rtdb.firebaseio.com",
  projectId: "buzzer-system-demo",
  storageBucket: "buzzer-system-demo.appspot.com",
  messagingSenderId: "170427468024",
  appId: "1:170427468024:web:b51f24c2a13d1c2b8a12bd"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);