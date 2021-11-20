import React from 'react';
import { dependencies } from '../../package.json';

const AboutView = () => {
  return (
    <div className="h-full">
      <h1>About</h1>
      <h2>Description</h2>
      <p>NazUtils is a simple app, with some tools like formatter, encoder/decoder...</p>
      <p>UI is ugly, sorry.</p>
      <h2>Dependencies</h2>
      <p>
        <ul>
          {Object.keys(dependencies).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </p>
      <div>
        Icons made by{' '}
        <a href="https://www.freepik.com" title="Freepik">
          Freepik
        </a>{' '}
        from{' '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
    </div>
  );
};

export default AboutView;
