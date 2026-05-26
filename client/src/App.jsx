import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import { useEffect, useState } from 'react';

import Login from './pages/Login';
import Streamer from './pages/Streamer';
import Viewer from './pages/Viewer';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [role, setRole] =
    useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem('token');

    const savedRole =
      localStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
    }

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('role');

    setIsLoggedIn(false);

    setRole('');

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 bg-black border-b border-gray-800">
        <h1
          className="text-3xl font-bold text-red-500 cursor-pointer"
          onClick={() => {
            if (role === 'streamer') {
              navigate('/streamer');
            } else if (
              role === 'viewer'
            ) {
              navigate('/viewer');
            }
          }}
        >
          StreamX
        </h1>

        {isLoggedIn && (
          <div className="flex items-center gap-6">
            <div className="bg-gray-800 px-5 py-2 rounded-xl">
              {role === 'streamer'
                ? 'Streamer Dashboard'
                : 'Viewer Dashboard'}
            </div>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-bold"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setIsLoggedIn={
                setIsLoggedIn
              }
              setRole={setRole}
            />
          }
        />

        <Route
          path="/streamer"
          element={
            <ProtectedRoute allowedRole="streamer">
              <Streamer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewer"
          element={
            <ProtectedRoute allowedRole="viewer">
              <Viewer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;