import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EncodeDecodeView from './pages/encode.decode.view';
import PrettierView from './pages/prettier.view';
import JWTView from './pages/jwt.view';
import LoremIpsumView from './pages/lorem.ipsum';
import SwaggerView from './pages/swagger.view';
import AboutView from './pages/about.view';

const views = [
  {
    link: '/formatter',
    name: 'Formatter',
    element: <PrettierView />,
  },
  {
    link: '/swagger',
    name: 'Swagger',
    element: <SwaggerView />,
  },
  {
    link: '/encode',
    name: 'Encode / Decode',
    element: <EncodeDecodeView />,
  },
  {
    default: true,
    link: '/jwt',
    name: 'JWT Tool',
    element: <JWTView />,
  },
  {
    link: '/lorem',
    name: 'Lorem Ipsum',
    element: <LoremIpsumView />,
  },
  {
    link: '/about',
    name: 'About',
    element: <AboutView />,
  },
];

function App() {
  return (
    <div className="bg-gray-300 h-full flex">
      <div className="bg-gray-300 h-full flex flex-col min-w-96 w-96 p-2">
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
