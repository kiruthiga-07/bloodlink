import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <div className="bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Save a life with <span className="text-red-600">BloodLink</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Connecting hospitals and patients with nearby blood donors, instantly, when it matters most.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-red-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">Real-time</p>
            <p className="text-red-100 text-sm mt-1">Instant donor alerts</p>
          </div>
          <div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-red-100 text-sm mt-1">Blood groups supported</p>
          </div>
          <div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-red-100 text-sm mt-1">Roles: Donor, Hospital, Admin</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Register', desc: 'Sign up as a donor with your blood group and city, or as a hospital pending verification.' },
            { step: '02', title: 'Request', desc: 'A verified hospital raises an emergency request specifying blood group and urgency.' },
            { step: '03', title: 'Respond', desc: 'Matching nearby donors get a live alert and can accept or decline instantly.' }
          ].map((s) => (
            <div key={s.step} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-red-600 font-bold text-sm mb-2">{s.step}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🩸', title: 'Real-Time Alerts', desc: 'Matching donors are notified instantly when blood is needed.' },
          { icon: '📍', title: 'Nearby Matching', desc: 'Find donors close to the hospital for faster response.' },
          { icon: '✅', title: 'Verified Hospitals', desc: 'Requests only come from verified hospital accounts.' }
        ].map((f) => (
          <div key={f.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home