import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { currentUser, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🩸</span>
          <span className="text-xl font-bold text-gray-900">BloodLink</span>
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-red-600 font-medium transition">
            Home
          </Link>

          {currentUser ? (
            <>
              <Link
                to={role === 'hospital' ? '/hospital-dashboard' : role === 'admin' ? '/admin-dashboard' : '/donor-dashboard'}
                className="text-gray-600 hover:text-red-600 font-medium transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-gray-600 hover:text-red-600 font-medium transition">
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar