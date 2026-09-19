function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🩸</span>
            <span className="text-lg font-bold text-white">BloodLink</span>
          </div>
          <p className="text-sm text-gray-400">
            Connecting hospitals and donors in real time, so no request goes unanswered.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">How it works</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Donors register their blood group and city</li>
            <li>Hospitals raise verified emergency requests</li>
            <li>Matching donors are alerted instantly</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Project</h4>
          <p className="text-sm text-gray-400">
            Built with React, Firebase Authentication, and Cloud Firestore for real-time data sync.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-800 px-6 py-4 text-center text-xs text-gray-500">
        © 2026 BloodLink · Academic project
      </div>
    </footer>
  )
}

export default Footer