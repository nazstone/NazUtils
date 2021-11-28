import React, { useContext, useRef, useState } from 'react';
import Editor from '../components/editor';
import ErrorFormat from '../components/error.format';
import GlobalContext from '../context/context';

const regexColorGroup = ['bg-indigo-400', 'bg-red-300', 'bg-purple-300', 'bg-green-300', 'bg-pink-300', 'bg-blue-300'];

const RegexView = () => {
  const input = useRef(null);

  const globalContext = useContext(GlobalContext);
  const { regex, setRegex } = globalContext;

  const [error, setError] = useState('');

  const { expression, text } = regex;
  const setExpression = (e) => {
    setRegex({ ...regex, expression: e });
  };
  const setText = (e) => {
    setRegex({ ...regex, text: e });
  };

  const transform = (v) => {
    let regexExpress;
    try {
      regexExpress = new RegExp(expression, 'gm');
    } catch (err) {
      return v;
    }
    const group = [...v.matchAll(regexExpress)];
    let currIndex = 0;
    if (!group || group.length === 0) {
      return v;
    }
    const l = group.map((e, i, arr) => {
      // get text before if need
      let textBefore;
      if (e.index !== currIndex) {
        textBefore = <span>{text.substr(currIndex, e.index - currIndex)}</span>;
      }

      const highlightFound = [];
      const subTextGrp = text.substr(e.index, e[0].length);
      let currIndexGrp = 0;
      if (e.length === 1) {
        highlightFound.push(<span className="bg-yellow-300">{subTextGrp}</span>);
      } else {
        // for each sub group
        for (let j = 1; j < e.length; j += 1) {
          const beginEltInSubTextGrp = subTextGrp.indexOf(e[j]);
          // if current index is not matching next one, then missing a block so need to add it
          if (currIndexGrp !== beginEltInSubTextGrp) {
            highlightFound.push(
              <span className="bg-yellow-300">
                {subTextGrp.substr(currIndexGrp, beginEltInSubTextGrp - currIndexGrp)}
              </span>
            );
          }
          // add the group search
          highlightFound.push(<span className={regexColorGroup[(j - 1) % regexColorGroup.length]}>{e[j]}</span>);
          currIndexGrp = beginEltInSubTextGrp + e[j].length;
          // add last part of search
          if (j + 1 === e.length) {
            highlightFound.push(<span className="bg-yellow-300">{subTextGrp.substr(currIndexGrp)}</span>);
          }
        }
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

  return (
    <div className="h-full p-2 flex flex-col">
      <input
        type="text"
        className="p-2 mb-2"
        ref={input}
        placeholder="([a-z]{3})"
        value={expression || ''}
        onChange={(e) => setExpression(e.target.value)}
      />
      <ErrorFormat error={error} setError={setError} />
      <Editor className="flex-1" transform={transform} onChange={onChange} value={text} />
    </div>
  );
};

export default RegexView;
