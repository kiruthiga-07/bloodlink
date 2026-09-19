# 🩸 BloodLink — Emergency Blood Donor Platform

BloodLink connects hospitals with nearby blood donors in real time. When a hospital raises an emergency blood request, matching donors are instantly alerted and can accept or decline — no page refresh needed.

**Live demo:** https://bloodlink-project-omega.vercel.app

## Features

- **Role-based accounts** — Donor, Hospital, and Admin, each with their own dashboard
- **Real-time emergency alerts** — Firestore listeners push matching requests to donors instantly
- **Hospital verification** — admins approve hospital accounts before they can raise requests
- **Request lifecycle tracking** — open → matched → fulfilled, visible live on both ends
- **Donor profile management** — editable details, availability toggle, and donation history

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Firebase Authentication, Cloud Firestore (real-time database)
- **Deployment:** Vercel

## How it works

1. Donors register with their blood group, city, and contact details
2. Hospitals register and wait for admin verification
3. A verified hospital raises an emergency request (blood group, urgency, units needed)
4. The system matches donors by blood group and pushes a live alert to their dashboard
5. Donors accept or decline in real time
6. The hospital sees responses instantly and marks the request fulfilled once complete

## Running locally

\`\`\`bash
git clone https://github.com/kiruthiga-07/bloodlink.git
cd bloodlink
npm install
npm run dev
\`\`\`

You'll also need to create your own Firebase project (Authentication + Firestore enabled) and add your config to `src/firebase.js`.

## Author

Kiruthiga — [GitHub](https://github.com/kiruthiga-07)