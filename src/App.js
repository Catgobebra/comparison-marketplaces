import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Main from "./components/pages/Main";
import ProductTable from "./components/pages/ProductTable";

const theme = createTheme({
  colorSchemes: {
    dark: true
  },
});

function App() {
  return (
   <ThemeProvider theme={theme}>
   <CssBaseline/>
   <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/index.html" element={<Main />} />
        <Route path="/comparison" element={<ProductTable/>} />
      </Routes> 
    </Router>
    </ThemeProvider>
  );
}

export default App;
