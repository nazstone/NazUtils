import React, { useRef, useState } from 'react';
import Editor from '../components/editor';

const RegexView = () => {
  const input = useRef(null);
  const [regex, setRegex] = useState();
  const [text, setText] = useState('');

  const transform = (v) => {
    const group = [...v.matchAll(regex)];
    let currIndex = 0;
    console.log(group);
    if (!group || group.length === 0) {
      return v;
    }
    const l = group.map((e, i, arr) => {
      const highlightFound = <span className="bg-red-300">{e[0]}</span>;

      // get text before if need
      let textBefore;
      if (e.index !== currIndex) {
        textBefore = <span>{text.substr(currIndex, e.index - currIndex)}</span>;
      }

      // get text after if need
      let textAfter = '';
      if (i + 1 === arr.length) {
        textAfter = <span>{text.substr(e.index + e[0].length)}</span>;
      }

      // all together
      const textUntilWord = (
        <span key={e.index}>
          {(textBefore && textBefore) || ''}
          {highlightFound}
          {(textAfter && textAfter) || ''}
        </span>
      );
      currIndex = e.index + e[0].length;
      return textUntilWord;
    });
    return l;
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onClick = () => {
    try {
      setRegex(new RegExp(input.current.value, 'gm'));
    } catch (error) {
      console.error(error);
    }
  };

  const onKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div className="h-full p-2 flex flex-col">
      <div className="flex py-2">
        <input type="text" className="flex-1 mr-2" ref={input} onKeyPress={onKeyPress} />
        <button type="button" className="btn" onClick={onClick}>
          Go
        </button>
      </div>
      <Editor className="flex-1" transform={transform} onChange={onChange} value={text} />
    </div>
  );
};

export default RegexView;
