import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EncodeDecodeView from './pages/encode.decode.view';
import FormatterView from './pages/prettier.view';
import JWTView from './pages/jwt.view';

const views = [
  {
    link: '/',
    default: true,
    name: 'Formatter',
    element: <FormatterView />,
  },
  {
    link: '/encode',
    name: 'Encode / Decode',
    element: <EncodeDecodeView />,
  },
  {
    link: '/jwt',
    name: 'JWT Tool',
    element: <JWTView />,
  },
];

function App() {
  return (
    <div className="bg-gray-300 h-full flex">
      <div className="bg-gray-300 h-full flex flex-col w-96 p-2">
        {views.map((v) => (
          <Link key={v.link} to={v.link}>
            {v.name}
          </Link>
        ))}
      </div>
      <Routes>
        {views.map((v) => (
          <Route key={v.link} default={v.default} path={v.link} element={v.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
