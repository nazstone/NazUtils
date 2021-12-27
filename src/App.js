import React, { useState } from 'react';
import { Routes, Route, Link, useMatch, useResolvedPath } from 'react-router-dom';
import PropTypes from 'prop-types';

// view
import EncodeDecodeView from './pages/en.de.code.view';
import PrettierView from './pages/prettier.view';
import JWTView from './pages/jwt.view';
import LoremIpsumView from './pages/lorem.ipsum';
import SwaggerView from './pages/swagger.view';
import AboutView from './pages/about.view';
import RegexView from './pages/regex.view';

// context
import GlobalContext from './context/context';
import regexDefault from './context/regex';
import loremDefault from './context/lorem';
import jwtDefault from './context/jwt';

const views = [
  {
    link: '/',
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
    link: '/regex',
    name: 'Regex',
    element: <RegexView />,
  },
  {
    link: '/about',
    name: 'About',
    element: <AboutView />,
  },
];

const CustomLink = ({ children, to, key }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      key={key}
      className={match ? 'bg-green-100 no-underline text-xl font-medium px-2' : 'no-underline text-lg px-2'}
      to={to}
    >
      {children}
    </Link>
  );
};

CustomLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
};

function App() {
  const [regex, setRegex] = useState(regexDefault);
  const [lorem, setLorem] = useState(loremDefault);
  const [jwt, setJwt] = useState(jwtDefault);
  const contextValue = { regex, setRegex, lorem, setLorem, jwt, setJwt };

  const [hideMenu, setHideMenu] = useState(false);
  const onClickHide = () => {
    setHideMenu(!hideMenu);
  };

  const menuStyle = `bg-gray-100 h-full flex flex-col relative ${(!hideMenu && 'min-w-48 w-48') || 'min-w-0 w-0'}`;

  return (
    <GlobalContext.Provider value={contextValue}>
      <div className="bg-gray-100 h-full flex">
        <div className={menuStyle}>
          <button
            type="button"
            className={`btn w-6 px-1 absolute bg-green-300 hover:bg-green-700 focus:ring-green-500 ${
              (hideMenu && '-right-4 top-24 z-10') || '-right-1 z-0'
            }`}
            onClick={onClickHide}
          >
            {(hideMenu && <>&rsaquo;</>) || <>&lsaquo;</>}
          </button>
          {!hideMenu &&
            views.map((v) => (
              <CustomLink key={v.name} to={v.link}>
                {v.name}
              </CustomLink>
            ))}
        </div>
        <div className={`flex-1 h-full bg-green-300 ${!hideMenu && 'z-10'}`}>
          <Routes>
            {views.map((v) => (
              <Route key={v.link} default={v.default} path={v.link} element={v.element} />
            ))}
          </Routes>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}

export default App;
