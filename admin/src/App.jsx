import React from "react";
import { Routes ,Route} from "react-router-dom";
import Home from './pages/Home.jsx';
import ListMovies from "./pages/ListMovies.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Bookings from "./pages/Bookings.jsx";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/listmovies' element={<ListMovies/>}/>
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/bookings' element={<Bookings/>} />
    </Routes>
  );
  
  ;
};

export default App;
