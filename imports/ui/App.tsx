import * as React from 'react';
import { FunctionComponent, MouseEvent } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ReactElement } from 'rehype-react/lib';
import { LeGrid } from './GridOverview';
import { Home } from './Home';
import { Info } from './Info';
import { LoginForm } from './Login';
import { Pages } from './Pages';
import { Up } from './Upload';

const DaNav: FunctionComponent<{ children: ReactElement[] }> = ({ children }) => {

  const [relx, setRelx] = React.useState<number>(NaN)

  const handleMouseMove = React.useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      console.log(ev)

      const minX = ev.currentTarget.offsetLeft
      const width = ev.currentTarget.offsetWidth;
      const maxX = minX + width

      const px = ev.pageX
      if (px > maxX || px < minX) {
        setRelx(NaN)
      }
      else {
        setRelx((px - minX) / width)
      }

      console.log(minX, maxX, width)


    }, [children.length]
  )
  const handleOnMouseOut = React.useCallback(ev => { console.log('out'); setRelx(NaN) }, [children.length])

  console.log(relx)
  const getPadTop = (idx) => {
    if (isNaN(relx)) {
      return {}
    }
    const x = idx / (children.length - 1)
    return { '--fac': ( unitPulse(1.2 * (x - relx))) }

  }


  return <nav id="navtop" className="few"
    onMouseOut={handleOnMouseOut}
    onMouseMove={handleMouseMove}>
    {children.map((c, idx) => {
      const copy = React.cloneElement(c, { style: getPadTop(idx) } )
      console.log(copy.props)
      return copy
    }
    )}
  </nav>
}

export const BottomNav = React.createContext((a) => { })


const toggleDark = () => document.getElementById('body').classList.toggle('dark')
export const App = () => {

  const [bottomNav, setBottomNav] = React.useState(<div>Leer</div>)


  return (
    <BrowserRouter>
      <div id='mainContainer'>
        <nav id="sidebar"></nav>
        <section id="topright">
          <div id="fp_darkmode" onClick={toggleDark} >Dark Mode</div>
          <LoginForm />
        </section>
        <DaNav >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/pages">Pages</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/files">Files</NavLink>
          <NavLink to="/projekte">Projekte</NavLink>
        </DaNav>
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


function wind(x, w, s) {

}

function unitPulse(x) {
  if (x < -0.5 || x > 0.5) {
    return 0;
  }
  // return Math.pow(Math.cos(x),2)
  return 1 - Math.abs(2 * x)
}
