import * as React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { LeGrid } from './GridOverview';
import { Home } from './Home';
import { Info } from './Info';
import { LoginForm } from './Login';
import { Pages } from './Pages';
import { Up } from './Upload';


export const BottomNav = React.createContext((a) => { })


const toggleDark = () => document.getElementById('body').classList.toggle('dark')
export const App = () => {

  const [bottomNav, setBottomNav] = React.useState(<div>Leer</div> )


  return (
    <BrowserRouter>
      <div id='mainContainer'>
        <nav id="sidebar"></nav>
        <section id="topright">
          <div id="fp_darkmode" onClick={toggleDark} >Dark Mode</div>
          <LoginForm />
        </section>
        <nav id="navtop" className="few">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pages">Pages</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/files">Files</Link>
        </nav>
        <div id="contentContainer">
          <BottomNav.Provider value={setBottomNav}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/*" element={<LeGrid />} />
            <Route path="/about" element={<Info />} />
            <Route path="/pages/*" element={<Pages />} />
            <Route path="/files/*" element={<Up />} />
          </Routes>
          </BottomNav.Provider>
        </div>
        <div id="navbottom" >
          {bottomNav}
        </div>

      </div>
    </BrowserRouter>
  );
}


