import {
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useEffect,
  useState,
} from 'react';

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

  // CHECK LOCAL STORAGE ON PAGE LOAD
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

  // LOGOUT FUNCTION
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
      <nav className="flex items-center justify-between px-8 py-4 bg-black border-b border-gray-800">
        {/* LOGO */}
        <h1 className="text-2xl font-bold text-red-500">
          StreamX
        </h1>

        {/* NAVIGATION */}
        <div className="flex gap-6 items-center">
          {/* LOGIN */}
          {!isLoggedIn && (
            <Link
              to="/"
              className="hover:text-red-400 transition"
            >
              Login
            </Link>
          )}

          {/* STREAMER NAVBAR */}
          {isLoggedIn &&
            role === 'streamer' && (
              <>
                <Link
                  to="/streamer"
                  className="hover:text-red-400 transition"
                >
                  Streamer Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}

          {/* VIEWER NAVBAR */}
          {isLoggedIn &&
            role === 'viewer' && (
              <>
                <Link
                  to="/viewer"
                  className="hover:text-red-400 transition"
                >
                  Viewer Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        {/* LOGIN PAGE */}
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

        {/* STREAMER PAGE */}
        <Route
          path="/streamer"
          element={
            <ProtectedRoute allowedRole="streamer">
              <Streamer />
            </ProtectedRoute>
          }
        />

        {/* VIEWER PAGE */}
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