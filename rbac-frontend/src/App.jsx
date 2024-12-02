import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <Dashboard />
        ) : showRegister ? (
          <>
            <Register onSuccess={() => setShowRegister(false)} />
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 text-blue-500 hover:text-blue-700"
            >
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <Login onSuccess={handleLoginSuccess} />
            <button
              onClick={() => setShowRegister(true)}
              className="mt-4 text-blue-500 hover:text-blue-700"
            >
              Dont have an account? Register
            </button>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;