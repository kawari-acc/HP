import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase 設定（管理者用と同じ）
const firebaseConfig = {
  apiKey: "AIzaSyAqLmoaG4B7Z9ahTcdqIBlbkM3RABMllRI",
  authDomain: "xdiary-project-c16de.firebaseapp.com",
  projectId: "diary-project-c16de",
  storageBucket: "diary-project-c16de.firebasestorage.app",
  messagingSenderId: "1024852965954",
  appId: "1:1024852965954:web:80b3d9ffe5fecc58c78bdb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 日記読み込み（管理者用と同じく日付まとめ）
async function loadDiary() {
  const diaryRef = collection(db, "diary");
  const q = query(diaryRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);

  const grouped = {};

  querySnapshot.forEach((docItem) => {
    const data = docItem.data();

    let dateObj;
    if (typeof data.date === "string") {
      dateObj = new Date(data.date);
    } else if (data.date.toDate) {
      dateObj = data.date.toDate();
    } else {
      dateObj = new Date();
    }

    const dateKey = dateObj.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push({
      content: data.content,
      fullDate: dateObj.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    });
  });

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  let html = "";

  sortedKeys.forEach((dateKey) => {
    html += `<div class="date-group"><h3>${dateKey}</h3>`;

    grouped[dateKey].forEach((item) => {
      html += `
        <div class="entry">
          <p><strong>${item.fullDate}</strong></p>
          <p>${item.content}</p>
        </div>
      `;
    });

    html += `</div><hr>`;
  });

  document.getElementById("list").innerHTML = html;
}

loadDiary();