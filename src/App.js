import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./components/pages/Main";
import ProductTable from "./components/pages/ProductTable";
import {storageManager} from './components/comps/SwitchTheme';
import { CssBaseline } from '@mui/material';


const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
});

function App() {
  return (
   <ThemeProvider theme={theme} storageManager={storageManager}>
   <CssBaseline />
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
