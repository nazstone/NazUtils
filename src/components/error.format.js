import React from 'react';
import PropTypes from 'prop-types';

const ErrorFormat = (props) => {
  const { error, setError } = props;
  if (error) {
    return (
      <div className="bg-red-500 text-white mt-2 mb-2 relative min-h-2">
        <div className="absolute right-0 pr-2 pl-2 pt-1 pb-1 border-2 bg-red-500" onClick={() => setError()}>
          X
        </div>
        <pre className="overflow-auto whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }
  return <></>;
};

ErrorFormat.propTypes = {
  error: PropTypes.string,
  setError: PropTypes.func,
};

ErrorFormat.defaultProps = {
  error: '',
  setError: () => {},
};

export default ErrorFormat;
