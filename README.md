# **Agri Grow**

An AI-powered web application designed to assist farmers with queries, provide multilingual support, and offer voice-enabled interactions.

---


<img width="1898" height="905" alt="Screenshot 2025-09-30 105655" src="https://github.com/user-attachments/assets/c15d49e9-cea5-46ea-8ba7-395ff0a94c7f" />







<img width="1886" height="930" alt="Screenshot 2025-09-30 105732" src="https://github.com/user-attachments/assets/df0b2688-1aca-4611-9a45-09320c224e24" />






## **Table of Contents**

* **Introduction**
* **Features**
* **Tech Stack**
* **Installation & Setup**
* **Environment Variables**
* **Supabase & OpenAI Integration**
* **Running the Project**
* **Folder Structure**
* **Usage Guide**
* **Future Enhancements**
* **Contributing**
* **License**

---

## **Introduction**

**Agri Grow** is a digital companion for farmers. It integrates AI technology to provide quick, conversational, and multilingual support to farmers’ queries. The platform offers voice-enabled interactions, an editable user profile, and a clean user experience with localized language support.

---

## **Features**

* Animated **rain droplet / vapour background** on Get Started page
* Secure **sign-up/sign-in** system (via Supabase)
* **Editable user profile** page
* **Navigation bar** shown only to signed-in users
* **Language selector** (persists across pages and sessions)
* AI assistant connected to **OpenAI API** via **Supabase**
* **ChatGPT-like features**: conversational memory, multi-turn chats
* **Voice input support** (speech-to-text)
* Mobile-friendly, responsive UI

---

## **Tech Stack**

* **Frontend**: React / Next.js
* **Backend**: Supabase (Auth, Database, Edge Functions)
* **AI**: OpenAI API
* **Voice Input**: SpeechRecognition Web API
* **Styling**: Tailwind CSS

---

## **Installation & Setup**

1. Clone the repository:

   git clone https://github.com/Sridhar1431S/farm-sathi-grow.git
   cd farm-sathi-grow

2. Install dependencies:

   npm install
   # or
   yarn install

3. Create an `.env.local` file (see below).

## **Environment Variables**

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

## **Supabase & OpenAI Integration**

* **Authentication**: Handled by Supabase (sign-up/sign-in).
* **Database**: Stores user profiles, language preferences, and chat history.
* **Edge Functions**: Forward chat requests from frontend → Supabase → OpenAI API → back to frontend.
* **Chat Memory**: Stored per session to allow contextual, multi-turn conversations.
* **Language Preference**: Saved in Supabase or localStorage to persist across sessions.

## **Running the Project**

* Development:
  npm run dev

* Production build:
  npm run build
  npm run start

## **Folder Structure**

farm-sathi-grow/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Pages (Next.js routing)
│   ├── lib/              # Supabase/OpenAI helpers
│   ├── styles/           # Tailwind / CSS
│   └── hooks/            # Custom React hooks
├── .env.local
├── package.json
└── README.md

## **Usage Guide**

1. Open the app → **Get Started page** (animated rain/vapour background).
2. Click **Get Started** → Redirects to sign-up/sign-in.
3. Once logged in:

   * Navigation bar appears
   * Language preference can be set
   * Profile can be updated
   * AI assistant can answer queries in text or via voice
4. Chat history and preferences persist across sessions.

## **Future Enhancements**

* Image upload for crop/soil analysis
* Push notifications (e.g., weather, pest alerts)
* Offline-first support / PWA
* Text-to-speech for AI replies
* Extended support for regional dialects


## **License**

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

#Built by SR 
