/* **************************************** */
/*                  背景                    */
/* **************************************** */
import { useState } from 'react';
import Sketch from "react-p5";
import { createVector, map } from "./libOriginal/p5jsOrigin"

export default function Background({ BackgroundId }) {
  const [noiseCords, setNoiseCords] = useState([]);
  let vertexNum = 16;

  const setup = (p5, canvasParentRef) => {
    let sketchNode = document.getElementById(BackgroundId);

    let w = p5.windowWidth;
    let h = p5.windowHeight;

    p5.createCanvas(w, h).parent(canvasParentRef);

    /* p5のスケッチ内容を梱包している要素の幅を調整する */
    let sketchWrapper = sketchNode.childNodes[0];

    sketchWrapper.style.width = w + 'px';
    sketchWrapper.style.height = h + 'px';

    p5.angleMode(p5.DEGREES);
    p5.colorMode(p5.HSB);
    p5.noFill();

    noiseInit(p5);
  };

  const draw = (p5) => {
    let num = 35;                       // 線(層)の数
    let rotateVelocity = 0.1;           // 回転速度
    let starStrkWeight = 2;             // 図形のストロークの太さ
    let amountOfNoiseChange = 0.00006;  // ノイズの激しさ

    // useStateタイプの変数の初期化が間に合わない場合のエラー処理
    if (noiseCords.length == 0) {
      noiseInit(p5);
      return;
    }

    // 背景をクリアする
    p5.blendMode(p5.BLEND); // 線形保管のブレンドモード(デフォルト)
    p5.background(10);

    p5.push();

    // 描画スタイルの設定
    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(rotateVelocity * p5.frameCount);  // 回転の描画
    p5.strokeWeight(starStrkWeight);

    // 複数の図形の描画: 1ループ毎に1層だけ描画する
    for (let l = 0; l < num; l++) {
      let w = l * p5.width / 4 / num;

      // 発光の描画設定
      p5.blendMode(p5.SCREEN);                  // 色の逆数値
      p5.stroke(0 + (180 / num) * l, 80, 100);  // 最も外側の層を色相の中間値に合わせる

      displayShape(p5, 0, 0, w, w, l);
      noiseUpdate(amountOfNoiseChange);
    }
    p5.pop();
  };

  function displayShape(p5, x, y, w, h, l) {
    let v = [];
    let amplitudeOfNoise;            // ノイズの振れ幅

    // 頂点座標の定義
    v = [
      createVector(0.054, -0.581),
      createVector(0.158, -0.411),
      createVector(0.613, -0.522),
      createVector(0.413, -0.052),
      createVector(1, 0.256),
      createVector(0.724, 0.635),
      createVector(0.289, 0.276),
      createVector(0.151, 0.753),
      createVector(-0.028, 0.262),
      createVector(-0.277, 0.655),
      createVector(-0.36, 0.073),
      createVector(-0.871, 0.302),
      createVector(-0.988, -0.3),
      createVector(-0.353, -0.084),
      createVector(-0.415, -1),
      createVector(-0.111, -0.261)
    ];

    if (p5.width > p5.height) {
      amplitudeOfNoise = p5.width / 20;
    } else {
      amplitudeOfNoise = p5.height / 20;
    }

    p5.push();

    // 座標変換
    p5.translate(x, y);

    p5.beginShape();

    for (let i = 0; i < (v.length); i++) {
      let vertexIndex = i % v.length;

      v[vertexIndex].multV(createVector(w, h));

      // ノイズベクトルの算出
      let noiseVector = createVector(
        map(p5.noise(noiseCords[vertexIndex].x), 0, 1, -0.2, 0.2),
        map(p5.noise(noiseCords[vertexIndex].y), 0, 1, -0.2, 0.2)
      );

      // 外層ほど大きいノイズの影響を受ける
      noiseVector.mult(l * amplitudeOfNoise);

      // 各頂点にノイズを加える
      v[vertexIndex].addV(createVector(noiseVector.x, noiseVector.y));

      p5.curveVertex(v[vertexIndex].x, v[vertexIndex].y);
    }

    p5.curveVertex(v[0].x, v[0].y);
    p5.curveVertex(v[1].x, v[1].y);
    p5.curveVertex(v[2].x, v[2].y);

    p5.endShape();

    p5.pop();
  }

  function noiseInit(p5) {
    let newNoiseCords = [];

    // キャンバスの縦横比率に合わせたノイズの成分定義
    let windowRate = {
      w: p5.width / 2,
      h: p5.height / 2,
    };

    if (p5.width > p5.height) {
      windowRate.w /= p5.width;
      windowRate.h /= p5.width;
    } else {
      windowRate.w /= p5.height;
      windowRate.h /= p5.height;
    }

    // ノイズの初期化
    for (let i = 0; i < vertexNum; i++) {
      newNoiseCords[i] = createVector(
        p5.random(-windowRate.w, windowRate.w),
        p5.random(-windowRate.h, windowRate.h)
      );
    }

    setNoiseCords(newNoiseCords.slice());
  }

  // ノイズを更新する
  function noiseUpdate(amountOfChange) {
    for (let i = 0; i < vertexNum; i++)
      noiseCords[i].addV(createVector(amountOfChange, amountOfChange));
  }

  return (
    <div id={BackgroundId}>
      <Sketch
        setup={setup}
        draw={draw}
      />
    </div>
  );
};
