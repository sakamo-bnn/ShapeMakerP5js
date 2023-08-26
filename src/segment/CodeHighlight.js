import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // Prism.jsのスタイルシート

const CodeHighlight = ({ id, code, language }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = code;
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className='CodeHighlight'>
      <pre>
        <code id={id} ref={codeRef} className={`language-${language}`} />
      </pre>
    </div>
  );
};

export default CodeHighlight;
