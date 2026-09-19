import { useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')
  const [role, setRole] = useState('donor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      const userData = { name, email, role, createdAt: new Date() }

      if (role === 'donor') {
        userData.bloodGroup = bloodGroup
        userData.city = city
        userData.available = true
      }

      if (role === 'hospital') {
        userData.city = city
        userData.verified = false
      }

      await setDoc(doc(db, 'users', uid), userData)
      navigate(role === 'hospital' ? '/hospital-dashboard' : '/donor-dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-red-600 text-white p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🩸</span>
          <span className="text-xl font-bold">BloodLink</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold mb-3">Join a life-saving network.</h2>
          <p className="text-red-100 max-w-sm">
            Register as a donor to get real-time alerts nearby, or as a hospital to reach donors instantly during emergencies.
          </p>
        </div>
        <p className="text-red-200 text-sm">© 2026 BloodLink</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
          <p className="text-gray-500 text-sm mb-6">Register as a donor or hospital.</p>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                role === 'donor' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              I'm a Donor
            </button>
            <button
              type="button"
              onClick={() => setRole('hospital')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                role === 'hospital' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              I'm a Hospital
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'hospital' ? 'Hospital Name' : 'Full Name'}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            {role === 'donor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white"
                >
                  <option value="">Select blood group</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-red-600 font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup