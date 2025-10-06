import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./components/Main";
import ProductTable from "./components/ProductTable";

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/index.html" element={<Main />} />
        <Route path="/comparison.html" element={<ProductTable/>} />
      </Routes> 
    </Router>
  );
}

export default App;
