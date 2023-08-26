/* ************************************** */
/*                設定画面                 */
/* ************************************** */
/* <　実装内容　>                          */
/* ボタン                                 */
/* - 直線を描くか曲線を描くか               */
/* - 図形を閉じるか否か                     */
/* ************************************** */
import CodeHighlight from './CodeHighlight'; // コードハイライトのコンポーネント

// 設定画面内の固定テキスト
const str = {
  // テキストボックスに表示する文字列
  text: "関数名",
};

// 生成されたコードを表示するコンポネント
export default function Code({ generateCode, generatedCode }) {
  function copyToClipboard() {
    navigator.clipboard.writeText(generatedCode);
  }

  return (
    <div className="Code">

      <div className='CodeUI'>
        <input type="text" id="functionName" onInput={generateCode} placeholder={str.text}></input>
        <button onClick={copyToClipboard}>コピー</button>
      </div>

      <CodeHighlight
        id="code"
        code={generatedCode}
        language="javascript"
      />
    </div >
  );
}