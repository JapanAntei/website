<template>
    <summary>仕様解説</summary>
    <h3>スコアの計算式</h3>
    <p style="font-weight: 700;">基本スコア = 25 * (レベル + 1) * 消去ライン数^2</p>
    <p>X-Spin時、消去ライン数を2倍</p>
    <p>X-Spin Mini時、基本スコアを2倍</p>
    <p>基本スコアを、ライン消去直前の特殊回転の回数+1倍</p>
    <p>All Clear時、基本スコアを10倍</p>
    <h3>落下速度</h3>
    <p style="font-weight: 700;">落下間隔[ms] = 700 - レベル * 50</p>
    <p>レベル14以上では、理論上落下間隔が0msになります。</p>
    <h3>Super Rotation Systemについて</h3>
    <p>Tetrisちゃんねる(<a href="https://tetrisch.github.io/main/srs.html" target="_blank" rel="noopener noreferrer">https://tetrisch.github.io/main/srs.html</a>)に準拠した回転をします。</p>
    <p>一直線のミノのみI字ミノと同様の回転をします。</p>
    <h3>T-Spin判定</h3>
    <p>T字ミノ(ID: 6)でのライン消去時、四隅のうち3箇所が埋まっていたら、</p>
    <p>空いているのが凸側なら、T-Spin Mini</p>
    <p>空いているのが平ら側なら、T-Spin</p>
    <h3>Dot-Spin判定</h3>
    <p>1マスミノ(ID: 7)でのライン消去時、</p>
    <p>上下左右が埋まっていたら、Dot-Spin Mini</p>
    <p>斜めも含め周り全マスが埋まっていたら、Dot-Spin</p>
    <h3>G-Spin判定</h3>
    <p>ﾌの字(ID: 11)及び逆ﾌの字(ID: 12)によるライン消去時、</p>
    <p>回転の中心と、凵の字に見立てたときに欠けているマスが埋まっていれば、G-Spin Mini</p>
    <p>それに加え、回転の中心から見てブロックがない側3マスも埋まっていれば、G-Spin</p>
</template>