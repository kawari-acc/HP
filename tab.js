  const btn = document.getElementById("menu1");
  const menu = document.getElementById("Yoko-list");
  const openArea = document.getElementById("open-area");

//ボタン開閉
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  
//左エリア開閉
openArea.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.add("open");
  openArea.style.display = "none"; //開で透明エリアを削除

});

//メニュー外を押して閉じる
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== btn) {
    menu.classList.remove("open");
    openArea.style.display = "block"; //閉じたら復活

  }
});