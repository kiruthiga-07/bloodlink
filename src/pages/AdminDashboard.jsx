import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'

function AdminDashboard() {
  const [hospitals, setHospitals] = useState([])
  const [donorCount, setDonorCount] = useState(0)
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'hospital'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHospitals(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'donor'))
    const unsubscribe = onSnapshot(q, (snapshot) => setDonorCount(snapshot.size))
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'requests'), (snapshot) => {
      setRequestCount(snapshot.size)
    })
    return unsubscribe
  }, [])

  const setVerified = async (id, value) => {
    await updateDoc(doc(db, 'users', id), { verified: value })
  }

  const pending = hospitals.filter(h => !h.verified)
  const verified = hospitals.filter(h => h.verified)

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin dashboard</h1>
        <p className="text-gray-500 mb-8">Platform overview and hospital verification.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-red-50 rounded-xl border border-red-100 p-5">
            <p className="text-xs text-red-700 uppercase tracking-wide mb-1">Total donors</p>
            <p className="text-2xl font-bold text-red-600">{donorCount}</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Total hospitals</p>
            <p className="text-2xl font-bold text-blue-600">{hospitals.length}</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
            <p className="text-xs text-amber-700 uppercase tracking-wide mb-1">Pending verification</p>
            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          </div>
          <div className="bg-gray-100 rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total requests</p>
            <p className="text-2xl font-bold text-gray-900">{requestCount}</p>
          </div>
        </div>

        <h2 className="font-semibold text-gray-900 mb-3">Pending verification ({pending.length})</h2>
        <div className="space-y-3 mb-10">
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-gray-500 text-sm">
              No hospitals waiting for verification.
            </div>
          ) : (
            pending.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{h.name}</p>
                  <p className="text-sm text-gray-500">{h.email} · {h.city}</p>
                </div>
                <button
                  onClick={() => setVerified(h.id, true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition text-sm"
                >
                  Verify
                </button>
              </div>
            ))
          )}
        </div>

        <h2 className="font-semibold text-gray-900 mb-3">Verified hospitals ({verified.length})</h2>
        <div className="space-y-3">
          {verified.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-gray-500 text-sm">
              No verified hospitals yet.
            </div>
          ) : (
            verified.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{h.name}</p>
                  <p className="text-sm text-gray-500">{h.email} · {h.city}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard