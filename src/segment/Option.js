/*                設定画面                */
/* ************************************** */
/* <　実装内容　>                         */
/* ボタン                                 */
/* - 直線を描くか曲線を描くか              */
/* - 図形を閉じるか否か                    */
/* ************************************** */
import { optionInfo } from "../App";

// 設定画面内の固定テキスト
const str = {
  // ボタン
  btn:
  {
    vertex: "直線",
    curveVertex: "曲線",
    close: "CLOSE",
    open: "OPEN",
    barycenter: "重心",
    origin: "原点",
  },
};

export default function Option({ generateCode }) {
  function validVertex() {
    optionInfo.isCurveVertex = false;

    generateCode();
  }

  function validCurveVertex() {
    optionInfo.isCurveVertex = true;

    generateCode();
  }

  function validClose() {
    optionInfo.isClose = true;

    generateCode();
  }

  function validOpen() {
    optionInfo.isClose = false;

    generateCode();
  }

  function validBarycenter() {
    optionInfo.center.num = 0;

    generateCode();
  }

  function validOrigin() {
    optionInfo.center.num = 1;
    generateCode();
  }

  return (
    <div className="Option">
      <ul>
        <li>
          <button onClick={validVertex} className="leftButton">{str.btn.vertex}</button>
          <button onClick={validCurveVertex} className="rightButton">{str.btn.curveVertex}</button>
        </li>

        <li>
          <button onClick={validClose} className="leftButton">{str.btn.close}</button>
          <button onClick={validOpen} className="rightButton">{str.btn.open}</button>
        </li>

        <li>
          <button onClick={validBarycenter} className="leftButton">{str.btn.barycenter}</button>
          <button onClick={validOrigin} className="rightButton">{str.btn.origin}</button>
        </li>
      </ul>
    </div>
  );
}