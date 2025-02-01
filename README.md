# Sharebase

<div align="center">
  <br />
    <a href="https://sharebase.vercel.app" target="_blank">
      <img src="https://github.com/tmachnacki/portfolio/blob/master/src/assets/sharebase/home-dark-wide.webp" alt="ShareBase home page">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=06b6d4" alt="React" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=0EA5E9" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logoColor=white&logo=firebase&color=c2410c" alt="firebase" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=6d28d9" alt="vite" />
  </div>

  <h3 align="center">A Social Media Platform</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Run Locally](#run-locally)


## <a name="overview">Overview</a>

A social media platform featuring light and dark modes, responsive design, and real-time messaging. Users can create and edit posts, follow others, tag friends, add comments, send messages, and more.

All images via unsplash.

## <a name="tech-stack">Tech Stack</a>

- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- React Router
- Zustand
- Firebase
- Vite

## <a name="features">Features</a>

☑ **Home Page**: View latest posts in your feed, and discover new users to follow.

☑ **Create Post**: Add an image, caption, location, and tagged users, all with form validation.

☑ **Post Interactions**: Like, save, comment on, share, and edit posts.

☑ **Post Details Page**: A detailed view of a post, also display related content.

☑ **Profile Page**: View a user's profile, including their posts, followers, and following.

☑ **Live Messaging**: Send and receive messages with Firebase realtime database subscriptions.

☑ **Explore Page**: View posts from users you don't follow yet.

☑ **Firebase BaaS**: Firebase authentication with Google OAuth, Firestore document database, realtime database, and file storage.

☑ **Light and dark modes**: Switch between light, dark, and system themes.

☑ **Responsive design**: A seamless experience on all devices.


## <a name="run-locally">Run Locally</a>

Follow these steps to set up the project locally on your machine.

**Clone/Download the Repository**

```bash
git clone https://github.com/tmachnacki/sharebase.git
cd sharebase
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Register an account with [Firebase](https://firebase.google.com/). Follow the docs to set up a web app with auth, firestore, storage, and realtime database. Replace the `env` variables with your credentials.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:5173) in your browser to view the project.


#
