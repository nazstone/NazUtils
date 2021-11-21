import React from 'react';
import { dependencies } from '../../package.json';

const AboutView = () => {
  return (
    <div className="h-full p-2">
      <h1>About</h1>
      <h2 className="pt-2">Description</h2>
      <p>NazUtils is a simple app, with some tools like formatter, encoder/decoder...</p>
      <p>UI is ugly, sorry.</p>
      <h2 className="pt-2">Dependencies</h2>
      <p>
        <ul className="pl-2 italic">
          {Object.keys(dependencies).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </p>
      <p className="pt-2">
        Icons made by{' '}
        <a href="https://www.freepik.com" title="Freepik">
          Freepik
        </a>{' '}
        from{' '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </p>
    </div>
  );
};

export default AboutView;
