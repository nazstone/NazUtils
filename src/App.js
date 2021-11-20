import React from 'react';
import { Routes, Route, Link, useMatch, useResolvedPath } from 'react-router-dom';
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

// eslint-disable-next-line react/prop-types
function CustomLink({ children, to, key }) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div key={key} className={`${match ? 'bg-green-100' : ''} px-2`}>
      <Link className={match ? 'no-underline text-xl font-medium' : 'no-underline text-lg'} to={to}>
        {children}
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="bg-gray-300 h-full flex">
      <div className="bg-gray-300 h-full flex flex-col min-w-96 w-96">
        {views.map((v) => (
          <CustomLink key={v.link} to={v.link}>
            {v.name}
          </CustomLink>
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
