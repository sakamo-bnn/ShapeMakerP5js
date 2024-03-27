import { useState } from 'react';
import "./styles.css";
import Operation from './segment/Operation';
import Option from './segment/Option'
import Code from './segment/Code'
import Background from './segment/p5js/Background'

export let optionInfo = {
  isCurveVertex: false,
  isClose: true,
  center: {
    num: 0,
    mode: [
      "BARYCENTER",
      "ORIGIN",
    ]
  },
};

// 頂点情報
export let opeInfo = {
  vertexes: [],
  center: {
    x: 0,
    y: 0,
  },
};

export default function App() {
  // コードの内容
  const [completeGeneratedCode, setCompleteGeneratedCode] = useState("関数名を定義してください");
  let generatedCode = "";         // 生成されたコードとして表示する文字列
  let functionName = "";          // 関数名
  let vertexDefinition = [];      // 頂点の定義情報
  let vertexPutCode = "";         // 頂点の配置(図形の描画)コード

  // プログラムのコードを生成する関数(updateの内容のみ変更する)
  function generateCode() {
    vertexDefinition = normalizeVertex(opeInfo.vertexes).slice();
    functionName = document.getElementById("functionName").value;
    vertexPutCode = generateVertexPutCode();

    // 表示する文字列の作成
    if (functionName.length == 0) {             // 関数名が未定義であるとき
      generatedCode = "関数名を定義してください";
    } else if (opeInfo.vertexes.length < 3) {   // 描画内容が点や線であるとき
      generatedCode = "頂点を3つ以上定義してください";
    } else {                                    // 描画コードを作成する
      // 関数と引数，頂点の定義
      generatedCode = `function ${functionName} (x, y, w, h){\n  // 頂点座標の定義\n  let v = [\n`;

      for (let i = 0; i < vertexDefinition.length; i++) {
        generatedCode += `    createVector(${vertexDefinition[i].x}, ${vertexDefinition[i].y} )`;

        if (i < (vertexDefinition.length - 1))
          generatedCode += ",\n";
        else
          generatedCode += "\n";
      }

      // 頂点の定義(終了)と図形の描画開始
      generatedCode += "  ];\n\n  // 描画スタイルの設定\n  push();\n  translate(x, y);\n\n  // 図形の描画\n  beginShape();\n";

      // 頂点を配置して輪郭を描画するコード
      generatedCode += vertexPutCode;

      // 描画および関数の終了
      generatedCode += `\n  // 描画スタイルの復元\n  pop();\n}`;
    }

    // コードの表示
    setCompleteGeneratedCode(generatedCode);
  }

  // 中心の定義と頂点情報の正規化
  function normalizeVertex(vertexes) {
    let normalizedVertex = [];

    // 図形の中心座標の初期化
    opeInfo.center.x = 0;
    opeInfo.center.y = 0;

    // 図形の端の座標値
    let max = {
      x: 0,
      y: 0,
    };

    // 図形の中心座標を算出する
    switch (optionInfo.center.mode[optionInfo.center.num]) {
      case optionInfo.center.mode[0]: // 重心
        for (let i = 0; i < vertexes.length; i++) {
          opeInfo.center.x += vertexes[i].x;
          opeInfo.center.y += vertexes[i].y;
        }
        opeInfo.center.x /= vertexes.length;
        opeInfo.center.y /= vertexes.length;
        break;
      case optionInfo.center.mode[1]: // 座標軸の原点軸
        opeInfo.center.x /= vertexes.length;
        opeInfo.center.y /= vertexes.length;
        break;
      default:                        // 想定外の処理(実行されない)
        console.warn(`normalizeVertex >> Unknown request ${optionInfo.center.num}.`);
        break;
    }

    // 中心からみたx, y座標の最大値を取得する
    for (let i = 0; i < vertexes.length; i++) {
      let relative = {
        x: Math.max(vertexes[i].x, opeInfo.center.x) - Math.min(vertexes[i].x, opeInfo.center.x),
        y: Math.max(vertexes[i].y, opeInfo.center.y) - Math.min(vertexes[i].y, opeInfo.center.y),
      }


      if (max.x < relative.x)
        max.x = relative.x;

      if (max.y < relative.y)
        max.y = relative.y;
    }

    // 頂点の正規化
    for (let i = 0; i < vertexes.length; i++) {
      normalizedVertex.push({
        x: Math.round((vertexes[i].x - opeInfo.center.x) / (2 * max.x) * 1000) / 1000,
        y: Math.round((vertexes[i].y - opeInfo.center.y) / (2 * max.y) * 1000) / 1000,
      });
    }

    return normalizedVertex;
  }

  // 描画コードを変更する関数
  function generateVertexPutCode() {
    let generatedVertexPutCode = "";
    // 頂点を結ぶ線が直線であるか曲線か
    if (!optionInfo.isCurveVertex) {
      // 頂点の定義
      generatedVertexPutCode += "  for (let i = 0; i < v.length; i++)\n    vertex(v[i].x * w, v[i].y * h);\n";

      // 始点から終点を結ぶか否か
      if (!optionInfo.isClose) {
        generatedVertexPutCode += "  endShape();\n";
      } else {
        generatedVertexPutCode += "  endShape(CLOSE);\n";
      }
    } else {
      // 始点から終点を結ぶか否か
      if (!optionInfo.isClose) {
        // 調整として始点の定義
        generatedVertexPutCode += "  curveVertex(v[0].x*w, v[0].y*h);\n";

        // 頂点の配置
        generatedVertexPutCode += "  for (let i = 0; i < v.length; i++)\n    curveVertex(v[i].x * w, v[i].y * h);\n";

        // 調整として終点の再定義・図形を閉じる
        generatedVertexPutCode += "  curveVertex(v[v.length - 1].x*w, v[v.length - 1].y*h);\n  endShape();\n";
      } else {
        if (opeInfo.vertexes.length < 3) {
          // 調整として始点の定義
          generatedVertexPutCode += "  curveVertex(v[0].x*w, v[0].y*h);\n";

          // 頂点の配置と図形を閉じる
          generatedVertexPutCode += "  for (let i = 0; i < v.length; i++)\n    curveVertex(v[i].x * w, v[i].y * h);\n  endShape(CLOSE);\n";
        } else {
          // 頂点の配置
          generatedVertexPutCode += "  for (let i = 0; i < v.length; i++)\n    curveVertex(v[i].x * w, v[i].y * h);\n";

          // 滑らかに図形を描画するために頂点の再配置
          generatedVertexPutCode += "  for (let i = 0; i < 3; i++)\n    curveVertex(v[i].x * w, v[i].y * h);\n  endShape();\n";
        }
      }
    }

    return generatedVertexPutCode;
  }

  return (
    <div className="App">
      <Background BackgroundId="Background" />

      <div id='Contents'>
        {/* ヘッダコンテンツ */}
        <header>
          <div className="title">
            <h1>Shape Maker p5.js</h1>
          </div>
          <div className="hyperlink">
            <ul>
              <li><a href="https://editor.p5js.org/" target="_blank">p5.js Web Editor</a></li>
              <li><a href="https://openprocessing.org/" target="_blank">OpenProcessing</a></li>
            </ul>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main>
          <Operation generateCode={generateCode} className="mainLeftContent" />
          <div className="mainRightContent">
            <Option generateCode={generateCode} />
            <Code generateCode={generateCode} generatedCode={completeGeneratedCode} />
          </div>
        </main>
      </div>
    </div>
  );
}
