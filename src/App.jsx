import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.scss';
import Routes from './Routes/index';
import AuthHandler from './utils/AuthHandler';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
      <AuthHandler />
      <Routes />
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
