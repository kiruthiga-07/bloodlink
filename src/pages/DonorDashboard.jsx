import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import {
  collection, query, where, onSnapshot, orderBy,
  doc, updateDoc, getDoc, setDoc
} from 'firebase/firestore'

function DonorDashboard() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [requests, setRequests] = useState([])
  const [myMatches, setMyMatches] = useState([])
  const [respondingId, setRespondingId] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', currentUser.uid))
      if (snap.exists()) setProfile(snap.data())
    }
    fetchProfile()
  }, [currentUser])

  useEffect(() => {
    if (!profile?.bloodGroup) return
    const q = query(
      collection(db, 'requests'),
      where('bloodGroup', '==', profile.bloodGroup),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [profile])

  useEffect(() => {
    if (!currentUser) return
    const q = query(
      collection(db, 'matches'),
      where('donorId', '==', currentUser.uid),
      orderBy('respondedAt', 'desc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyMatches(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [currentUser])

  const toggleAvailable = async () => {
    const newValue = !profile.available
    await updateDoc(doc(db, 'users', currentUser.uid), { available: newValue })
    setProfile({ ...profile, available: newValue })
  }

  const respond = async (request, decision) => {
    setRespondingId(request.id)
    try {
      await setDoc(doc(db, 'matches', `${request.id}_${currentUser.uid}`), {
        requestId: request.id,
        donorId: currentUser.uid,
        donorEmail: currentUser.email,
        bloodGroup: request.bloodGroup,
        status: decision,
        respondedAt: new Date()
      })
      if (decision === 'accepted') {
        await updateDoc(doc(db, 'requests', request.id), { status: 'matched' })
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setRespondingId(null)
  }

  const urgencyColor = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-amber-100 text-amber-800',
    moderate: 'bg-blue-100 text-blue-800'
  }

  const respondedIds = myMatches.map(m => m.requestId)
  const visibleRequests = requests.filter(r => !respondedIds.includes(r.id))
  const acceptedCount = myMatches.filter(m => m.status === 'accepted').length
  const declinedCount = myMatches.filter(m => m.status === 'declined').length

  if (!profile) {
    return <div className="min-h-screen bg-gray-50 px-6 py-12 text-gray-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Donor dashboard</h1>
            <p className="text-gray-500">Welcome back, {profile.name}</p>
          </div>
          <a href="/donor-profile" className="text-red-600 font-medium text-sm hover:text-red-700 transition">
            Edit profile →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 rounded-xl border border-red-100 p-5">
            <p className="text-xs text-red-700 uppercase tracking-wide mb-1">Blood Group</p>
            <p className="text-2xl font-bold text-red-600">{profile.bloodGroup}</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">City</p>
            <p className="text-2xl font-bold text-blue-700">{profile.city}</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 p-5">
            <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Accepted</p>
            <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
          </div>
          <div className="bg-gray-100 rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Declined</p>
            <p className="text-2xl font-bold text-gray-500">{declinedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Availability status</p>
            <p className="text-sm text-gray-500">Toggle off if you can't currently donate</p>
          </div>
          <button
            onClick={toggleAvailable}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition ${
              profile.available
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {profile.available ? 'Available' : 'Unavailable'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-4">Matching emergency requests</h2>
            {visibleRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-gray-500 text-sm">
                No matching requests right now. You'll see one here the moment a hospital needs your blood group.
              </div>
            ) : (
              <div className="space-y-3">
                {visibleRequests.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{r.bloodGroup} needed · {r.units} unit{r.units > 1 ? 's' : ''}</p>
                        <p className="text-sm text-gray-500">{r.hospitalEmail}</p>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${urgencyColor[r.urgency] || 'bg-gray-100 text-gray-800'}`}>
                        {r.urgency}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => respond(r, 'accepted')}
                        disabled={respondingId === r.id}
                        className="flex-1 bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respond(r, 'declined')}
                        disabled={respondingId === r.id}
                        className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-60"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Recent activity</h2>
            {myMatches.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-gray-500 text-sm">
                No responses yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myMatches.slice(0, 6).map((m) => (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{m.bloodGroup} request</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        m.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard