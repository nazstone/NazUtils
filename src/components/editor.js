/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

const Editor = ({ value, className, onChange, transform }) => {
  const onChangeTextArea = (e) => {
    onChange(e);
  };
  const onScrollTextArea = (e) => {
    // eslint-disable-next-line no-undef
    const divCurr = document.getElementById('div_render_ta');
    divCurr.scrollTop = e.target.scrollTop;
  };

  return (
    <div className={`${className} relative overflow-auto`}>
      <textarea
        className="w-full h-full absolute bg-transparent p-0 border-none font-mono editor_outline text-base text-transparent overflow-auto"
        height="100%"
        onChange={onChangeTextArea}
        onScroll={onScrollTextArea}
        value={value}
      />
      <div
        id="div_render_ta"
        className="w-full h-full bg-white text-black font-mono editor_outline breakWords2 whitespace-pre-wrap overflow-auto"
      >
        {transform(value)}
      </div>
    </div>
  );
};
Editor.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  transform: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  onChange: () => {},
  value: '',
  className: '',
};

export default Editor;
