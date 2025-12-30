// ===============================
// Firebase 読み込み
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, orderBy, query,
  doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===============================
// Firebase 初期化
// ===============================
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

// 編集中のID
let editId = null;


// ===============================
// 投稿・更新処理
// ===============================
document.getElementById("submit").addEventListener("click", async () => {
  const text = document.getElementById("text").value;

  if (!text.trim()) {
    alert("日記が空です");
    return;
  }

  if (editId) {
    // 編集モード
    const docRef = doc(db, "diary", editId);
    await updateDoc(docRef, {
      content: text,
      date: new Date()
    });

    alert("更新しました！");
    editId = null;
    document.getElementById("submit").textContent = "投稿";

  } else {
    // 新規投稿
    await addDoc(collection(db, "diary"), {
      content: text,
      date: new Date()
    });

    alert("投稿しました！");
  }

  document.getElementById("text").value = "";
  loadDiary();
});


// ===============================
// 編集処理
// ===============================
window.editDiary = function (id, content) {
  document.getElementById("text").value = content;
  editId = id;
  document.getElementById("submit").textContent = "更新";
};


// ===============================
// 削除処理
// ===============================
window.deleteDiary = async function (id) {
  if (!confirm("本当に削除しますか？")) return;

  const docRef = doc(db, "diary", id);
  await deleteDoc(docRef);

  alert("削除しました！");
  loadDiary();
};


// ===============================
// 日記読み込み（日本時間で日付まとめ）
// ===============================
async function loadDiary() {
  const diaryRef = collection(db, "diary");
  const q = query(diaryRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);

  const grouped = {};

  querySnapshot.forEach((docItem) => {
    const data = docItem.data();

    // Timestamp型とstring型の両方に対応
    let dateObj;
    if (typeof data.date === "string") {
      dateObj = new Date(data.date);
    } else if (data.date.toDate) {
      dateObj = data.date.toDate();
    } else {
      dateObj = new Date();
    }

    // 日本時間で日付キーを作成（例：2025/12/28）
    const dateKey = dateObj.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push({
      id: docItem.id,
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

  // 日付キーを新しい順に並べる
  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  let html = "";

  sortedKeys.forEach((dateKey) => {
    html += `<div class="date-group"><h3>${dateKey}</h3>`;

    grouped[dateKey].forEach((item) => {
      html += `
        <div class="entry">
          <p><strong>${item.fullDate}</strong></p>
          <p>${item.content}</p>
          <button onclick="editDiary('${item.id}', \`${item.content.replace(/`/g, "\\`")}\`)">編集</button>
          <button onclick="deleteDiary('${item.id}')">削除</button>
        </div>
      `;
    });

    html += `</div><hr>`;
  });

  document.getElementById("list").innerHTML = html;
}


// ===============================
// 初回読み込み
// ===============================
loadDiary();