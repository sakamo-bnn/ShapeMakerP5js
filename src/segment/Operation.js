/* **************************************** */
/*                操作画面                  */
/* *************************************** */
/* < 実装内容 >                             */
/* Operation: 操作画面全体，ボタン関連の処理 */
/* - 画像挿入                               */
/* - クリア                                 */
/* - 取り消し関連                           */
/* - コードの生成                           */
/* Canvas: キャンバス(造形箇所)              */
/* **************************************** */
import Sketch from "react-p5";
import { optionInfo } from "../App";
import { opeInfo } from "../App";
import { createVector } from "./p5js/libOriginal/p5jsOrigin";

let history = [];     // 操作履歴
let delHistory = [];  // 削除した操作履歴

// 操作画面内の固定テキスト
const str = {
  // ボタン
  btn:
  {
    importImage: "Import Image",
    clear: "頂点のクリア",
    generateCode: "Generate Code",
    undo: "←",
    redo: "→",
  },
};

export default function Operation({ generateCode, className }) {
  // 操作の取り消し
  function undo() {
    if (history.length <= 1) return;

    delHistory.push(history.pop());
    opeInfo.vertexes = history[history.length - 1].slice();
    generateCode();
  }

  // 「操作の取り消し」の取り消し
  function redo() {
    if (delHistory.length < 1) return;

    history.push(delHistory.pop());
    opeInfo.vertexes = history[history.length - 1].slice();
    generateCode();
  }

  // 全頂点の削除
  function clear() {
    if (opeInfo.vertexes.length != 0) {
      opeInfo.vertexes = [].slice();
      history.push(opeInfo.vertexes.slice());
      delHistory = [];
      generateCode();
    }
  }

  return (
    <div id="Operation" className={className}>
      <div className="Operation">
        <div className="OperationTopButton">
          <button onClick={clear} className="leftButton" > {str.btn.clear}</button>
        </div>

        <Canvas CanvasId="Canvas" generateCode={generateCode} />

        <div className="OperationBottomButton">
          <button onClick={undo} className="leftButton" >{str.btn.undo}</button>
          <button onClick={redo} className="rightButton" >{str.btn.redo}</button>
        </div>
      </div>
    </div >
  );
}

function Canvas({ CanvasId, generateCode }) {
  let vertexRadius = 5; // 頂点を描画する円の半径

  const setup = (p5, canvasParentRef) => {
    // 画面左半分の横幅(style.css の --main-left-width と同じ値)を算出する
    let main_left_width = 0.5 * document.getElementById('root').clientWidth;
    // 左コンテンツの横幅(style.css の --main-left-contents と同じ値)を算出する
    let main_left_contents = 0.55;

    let w = main_left_contents * main_left_width;

    if (w > document.getElementById('Operation').clientHeight) {
      console.log("canvas size was chasnged")
      w = 0.8 * document.getElementById('Operation').clientHeight
    }

    p5.createCanvas(w, w).parent(canvasParentRef);

    p5.strokeWeight(1);
    p5.rectMode(p5.CENTER);

    history.push(opeInfo.vertexes.slice());

    /* p5のスケッチ内容を梱包している要素の幅を調整する */
    let sketchNode = document.getElementById(CanvasId);
    let sketchWrapper = sketchNode.childNodes[0];
    sketchWrapper.style.width = w + 'px';
    sketchWrapper.style.height = w + 'px';
  };

  const draw = (p5) => {
    p5.background(200);

    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);

    // 図形の描画
    shaper(p5); // p5オブジェクトを引数として渡す

    // 座標軸の描画
    p5.push();
    p5.stroke(0, 0, 255);
    p5.line(0, -p5.height / 2, 0, p5.height / 2); // y軸
    p5.stroke(255, 0, 0);
    p5.line(-p5.width / 2, 0, p5.width / 2, 0);   // x軸
    p5.pop();

    // 点の描画
    if (opeInfo.vertexes.length > 0) {
      // 頂点の描画: 始点
      p5.fill(255, 0, 0);
      p5.ellipse(opeInfo.vertexes[0].x, opeInfo.vertexes[0].y, vertexRadius, vertexRadius);

      // 頂点の描画: 中間に定義した点
      for (let i = 1; i < opeInfo.vertexes.length - 1; i++) {
        p5.fill(0);
        p5.ellipse(opeInfo.vertexes[i].x, opeInfo.vertexes[i].y, vertexRadius, vertexRadius);
      }

      // 頂点の描画: 終点
      p5.fill(0, 0, 255);
      p5.ellipse(
        opeInfo.vertexes[opeInfo.vertexes.length - 1].x,
        opeInfo.vertexes[opeInfo.vertexes.length - 1].y,
        vertexRadius,
        vertexRadius
      );

      // 重心の描画
      p5.fill(0, 255, 0);
      p5.translate(opeInfo.center.x, opeInfo.center.y);
      p5.rotate(p5.PI / 4);  // 45度の回転

      if (opeInfo.vertexes.length >= 3)
        p5.rect(0, 0, vertexRadius, vertexRadius);

    }
    p5.pop();
  };

  const mousePressed = (p5) => {
    // キャンバス外のクリックは無視する
    if (p5.mouseX < 0 || p5.width < p5.mouseX || p5.mouseY < 0 || p5.height < p5.mouseY)
      return;

    // 頂点の追加
    opeInfo.vertexes.push(createVector(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2));

    // 頂点履歴の更新
    history.push(opeInfo.vertexes.slice());
    delHistory = [];
    generateCode();
  };

  function shaper(p5) {
    // 頂点が未定義であるときは描画しない
    if (opeInfo.vertexes.length === 0) {
      return;
    }

    p5.push();
    p5.stroke(0);
    p5.beginShape();

    // 頂点を結ぶ線が直線であるか曲線か
    if (!optionInfo.isCurveVertex) {
      for (let i = 0; i < opeInfo.vertexes.length; i++) {
        p5.vertex(opeInfo.vertexes[i].x, opeInfo.vertexes[i].y);
      }

      // 始点から終点を結ぶか否か
      if (!optionInfo.isClose) {
        p5.endShape();
      } else {
        p5.endShape(p5.CLOSE);
      }
    } else {
      // 始点から終点を結ぶか否か
      if (!optionInfo.isClose) {
        p5.curveVertex(opeInfo.vertexes[0].x, opeInfo.vertexes[0].y);

        for (let i = 0; i < opeInfo.vertexes.length; i++)
          p5.curveVertex(opeInfo.vertexes[i].x, opeInfo.vertexes[i].y);

        p5.curveVertex(opeInfo.vertexes[opeInfo.vertexes.length - 1].x, opeInfo.vertexes[opeInfo.vertexes.length - 1].y);

        p5.endShape();
      } else {
        if (opeInfo.vertexes.length < 3) {
          p5.curveVertex(opeInfo.vertexes[0].x, opeInfo.vertexes[0].y);

          for (let i = 0; i < opeInfo.vertexes.length; i++)
            p5.curveVertex(opeInfo.vertexes[i].x, opeInfo.vertexes[i].y);

          p5.endShape(p5.CLOSE);
        } else {
          for (let i = 0; i < opeInfo.vertexes.length; i++)
            p5.curveVertex(opeInfo.vertexes[i].x, opeInfo.vertexes[i].y);

          for (let i = 0; i < 3; i++)
            p5.curveVertex(opeInfo.vertexes[i].x, opeInfo.vertexes[i].y);

          p5.endShape();
        }
      }
    }
    p5.pop();
  }

  return (
    <div id={CanvasId}>
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={mousePressed}
      />
    </div>
  );
};
