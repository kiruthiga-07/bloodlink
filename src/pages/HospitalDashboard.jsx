import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore'

function HospitalDashboard() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [bloodGroup, setBloodGroup] = useState('')
  const [urgency, setUrgency] = useState('high')
  const [units, setUnits] = useState(1)
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', currentUser.uid))
      if (snap.exists()) setProfile(snap.data())
    }
    if (currentUser) fetchProfile()
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return
    const q = query(
      collection(db, 'requests'),
      where('hospitalId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'requests'), {
        hospitalId: currentUser.uid,
        hospitalEmail: currentUser.email,
        bloodGroup,
        urgency,
        units: Number(units),
        status: 'open',
        createdAt: new Date()
      })
      setBloodGroup('')
      setUrgency('high')
      setUnits(1)
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const markFulfilled = async (id) => {
    await updateDoc(doc(db, 'requests', id), { status: 'fulfilled' })
  }

  const statusColor = {
    open: 'bg-amber-100 text-amber-800',
    matched: 'bg-blue-100 text-blue-800',
    fulfilled: 'bg-green-100 text-green-800'
  }

  const openCount = requests.filter(r => r.status === 'open').length
  const matchedCount = requests.filter(r => r.status === 'matched').length
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Hospital dashboard</h1>
        <p className="text-gray-500 mb-8">{profile?.name || currentUser?.email}</p>

        {profile?.verified === false ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800">
            Your hospital account is pending verification. You'll be able to raise requests once an admin approves your account.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-100 rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
              <p className="text-xs text-amber-700 uppercase tracking-wide mb-1">Open</p>
              <p className="text-2xl font-bold text-amber-600">{openCount}</p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Matched</p>
              <p className="text-2xl font-bold text-blue-600">{matchedCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-5">
              <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Fulfilled</p>
              <p className="text-2xl font-bold text-green-600">{fulfilledCount}</p>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Raise emergency request</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood group needed</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white"
                      >
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="moderate">Moderate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Units needed</label>
                      <input
                        type="number"
                        min="1"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                    >
                      {loading ? 'Sending...' : 'Send emergency request'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="md:col-span-2">
                <h2 className="font-semibold text-gray-900 mb-4">Your requests</h2>
                {requests.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-gray-500 text-sm">
                    No requests yet. Create one to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((r) => (
                      <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{r.bloodGroup} · {r.units} unit{r.units > 1 ? 's' : ''}</p>
                            <p className="text-sm text-gray-500 capitalize">{r.urgency} urgency</p>
                          </div>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[r.status] || 'bg-gray-100 text-gray-800'}`}>
                            {r.status}
                          </span>
                        </div>
                        {r.status === 'matched' && (
                          <button
                            onClick={() => markFulfilled(r.id)}
                            className="mt-3 w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            Mark as fulfilled
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HospitalDashboard