import * as React from 'react';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import Fileuploads from './Fileuploads';
import { LeGrid } from './GridOverview';
import { Hello } from './Hello';
import { Home } from './Home';
import { Info } from './Info';
import { LoginForm } from './Login';
import { Pages } from './Pages';
import { Up } from './Upload';

const toggleDark = () => document.getElementById('body').classList.toggle('dark')
export const App = () => (
  <BrowserRouter>
    <div>
      <div id="fp_darkmode" onClick={toggleDark} >Dark Mode</div>
      <nav className="few">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/pages">Pages</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/files">Files</Link>
      </nav>
      <h1>Welcome to Meteor!</h1>
      <LoginForm />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/*" element={<LeGrid />} />
        <Route path="/about" element={<Info />} />
        <Route path="/pages/*" element={<Pages />} />
        <Route path="/files/*" element={<Up />} />
      </Routes>
    </div>
  </BrowserRouter>
);
