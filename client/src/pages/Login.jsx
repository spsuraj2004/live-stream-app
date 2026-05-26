import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({
  setIsLoggedIn,
  setRole,
}) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // LOGIN FUNCTION
  const handleLogin = async () => {
    // VALIDATION
    if (!email || !password) {
      alert(
        'Please enter email and password',
      );
      return;
    }

    try {
      setLoading(true);

      // API CALL
      const response = await axios.post(
        'http://localhost:3000/auth/login',
        {
          email,
          password,
        },
      );

      // SUCCESS LOGIN
      if (
        response.data &&
        response.data.access_token
      ) {
        // STORE TOKEN
        localStorage.setItem(
          'token',
          response.data.access_token,
        );

        // STORE ROLE
        localStorage.setItem(
          'role',
          response.data.role,
        );

        // UPDATE STATES
        setIsLoggedIn(true);

        setRole(response.data.role);

        // REDIRECT
        if (
          response.data.role ===
          'streamer'
        ) {
          navigate('/streamer');
        } else if (
          response.data.role ===
          'viewer'
        ) {
          navigate('/viewer');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.log(error);

      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ENTER KEY LOGIN
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-2xl">
        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-500 mb-2">
            StreamX
          </h1>

          <p className="text-gray-400">
            Live Streaming Platform
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block mb-2 text-sm text-gray-300">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={
              handleKeyDown
            }
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-red-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            onKeyDown={
              handleKeyDown
            }
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-red-500"
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {loading
            ? 'Logging in...'
            : 'Login'}
        </button>

        {/* DEMO ACCOUNTS */}
        <div className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Demo Accounts
          </h2>

          {/* STREAMER */}
          <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-red-500">
            <p className="text-red-400 font-bold mb-2">
              Streamer Account
            </p>

            <p className="text-sm text-gray-300">
              Email:
              spsuraj2004@gmail.com
            </p>

            <p className="text-sm text-gray-300">
              Password: 123456
            </p>
          </div>

          {/* VIEWER */}
          <div className="bg-gray-800 rounded-xl p-4 border border-blue-500">
            <p className="text-blue-400 font-bold mb-2">
              Viewer Account
            </p>

            <p className="text-sm text-gray-300">
              Email:
              viewer@gmail.com
            </p>

            <p className="text-sm text-gray-300">
              Password: viewer123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;