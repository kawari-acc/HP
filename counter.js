import { 
  getFirestore, doc, getDoc, updateDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

async function countUp() {
  const ref = doc(db, "counter", "pageViews");

  await updateDoc(ref, { views: increment(1) });

  const snap = await getDoc(ref);
  document.getElementById("viewCount").textContent = snap.data().views;
}

countUp();