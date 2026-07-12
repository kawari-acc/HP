<?php

// uploadsフォルダがある場所
$uploadDirectory = __DIR__ . '/uploads';

// フォルダ内のファイルを取得
$files = scandir($uploadDirectory);

// 画像だけを入れる配列
$images = [];

foreach ($files as $file) {

    // jpg、png、gif、webpを画像として扱う
    if (preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file)) {
        $images[] = $file;
    }
}

// 更新日時が新しい画像を先頭に
usort($images, function ($a, $b) use ($uploadDirectory) {
    return filemtime($uploadDirectory . '/' . $b)
         - filemtime($uploadDirectory . '/' . $a);
});

?>


<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>イラストギャラリー</title>

<link rel="stylesheet" href="gallery-style.css">

    </style>
</head>

<body>
      <header class="site-header">
    <div class="logo-area">
      <a href="index.html" class="logo-link">
        <img
  src="https://raw.githubusercontent.com/kawari-acc/HP/main/images/logo.png"
  alt="Kawari"
>
      </a>
    </div>
    <nav class="site-nav" aria-label="メインメニュー">
      <a href="https://www.pixiv.net/users/117084566" class="nav-link">Pixiv</a>
      <a href="https://kawari.booth.pm/" class="nav-link">Booth</a>
      <a href="https://bsky.app/profile/kawari.jp" class="nav-link">Bluesky</a>
    </nav>
  </header>

    <h1>イラストギャラリー</h1>

    <div class="gallery">

        <?php foreach ($images as $image): ?>

            <a
                href="uploads/<?= rawurlencode($image) ?>"
                target="_blank"
            >
                <img
                    src="uploads/<?= rawurlencode($image) ?>"
                    alt=""
                    loading="lazy"
                >
            </a>

        <?php endforeach; ?>

    </div>


  <footer class="footer-nav">



    <a href="characters.html" class="footer-link"><span class="footer-line"></span>キャラ紹介<span class="footer-line"></span></a>
    <a href="log.html" class="footer-link"><span class="footer-line"></span>LOG<span class="footer-line"></span></a>

    <a href="https://kawariaya.shop/gallery/" class="footer-link"><span class="footer-line"></span>イラスト<span class="footer-line"></span></a>
    <a href="links.html" class="footer-link"><span class="footer-line"></span>リンク集<span class="footer-line"></span></a>
  </footer>

</body>
</html>