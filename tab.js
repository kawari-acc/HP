function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

//カウンター
import { 
  getFirestore, doc, getDoc, updateDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

// 閲覧数カウンター
async function countUp() {
  const ref = doc(db, "counter", "pageViews");

  // +1 する
  await updateDoc(ref, {
    views: increment(1)
  });

  // 現在の値を取得して表示
  const snap = await getDoc(ref);
  const count = snap.data().views;

  document.getElementById("viewCount").textContent = count;
}

countUp();