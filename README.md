# NoticeFlow AI ⚡
> **From Notice to Action in Seconds.**

NoticeFlow AI is a high-performance web application that converts official college circulars, exam schedules, and submission deadlines into structured calendar events (`.ics`), Google Calendar entries, and smart reminders.

Built for hackathons and academic environments using **React**, **Vite**, **Tailwind CSS**, and **Google Gemini 2.5 Flash**.

---

## 🎨 Visual Identity & Minimalist SaaS Design System

NoticeFlow AI is designed with a premium, human-crafted productivity SaaS aesthetic (inspired by Linear, Notion, and Superhuman):

| Token | Hex Code | Role in Application |
|---|---|---|
| **Primary Background** | `#F7F7F2` | Warm Ivory canvas for calm, low eye-strain navigation |
| **Secondary Background** | `#F0F2ED` | Soft Neutral for sub-panels, input fields & footer |
| **Sidebar Navigation** | `#192B3A` | Midnight Navy sidebar with elegant icons and active state |
| **Primary Brand** | `#267F73` | Muted Teal for CTAs, active pills & progress indicators |
| **Primary Hover** | `#1E6B61` | Deepened Teal hover transition |
| **Card Background** | `#FFFFFF` | Crisp White cards with subtle border dividers |
| **Secondary Accent** | `#DDEAE4` | Soft Sage for success badges, tags & synopsis tabs |
| **Main Typography** | `#263238` | High-contrast Charcoal headings (*Plus Jakarta Sans*) |
| **Secondary Text** | `#718096` | Slate Grey for dates, metadata & subtitles (*Inter*) |
| **Subtle Borders** | `#E5E9E5` | Micro-dividers separating cards and grid cells |
| **Success** | `#38866B` | Completed tasks, verification indicators |
| **Warning** | `#D9A441` | Approaching deadlines & Demo Mode notices |
| **Danger** | `#D66C65` | Urgent priority notices & 24h critical alerts |
| **Information** | `#668BA8` | Scheduled examinations & informational chips |

---

## 🌟 Key Features

### 1. Modern Dashboard
- **Real-Time Academic Metrics**: Total notices processed, active submission deadlines, upcoming exams, and urgent priority alerts.
- **24-Hour Urgency Radar**: Highlights critical submissions due within 24 hours.
- **Activity Feed**: Logs uploads, confirmations, exports, and timeline adjustments.

### 2. Multi-Format Notice Upload
- **Supported File Types**: Digital & scanned PDFs, PNG, JPG, and JPEG documents.
- **Client-Side PDF Extraction**: Uses `pdfjs-dist` to extract raw text and render first-page canvas thumbnails.
- **Multimodal AI Ingestion**: Directly analyzes document images via Gemini Vision capabilities.
- **Instant Sample Notice Library**: 4 pre-curated university circulars (VTU Exam Schedule, Capstone Project Deadlines, Hackathon Registration, and State Scholarship Renewal) for instant 1-click evaluation without uploading files.

### 3. AI Notice Extraction (Google Gemini)
- Distinguishes **announcement issue dates** from actual **event and examination dates**.
- Distinguishes **registration/payment cutoffs** from **examination commencement**.
- Detects **multiple events** in a single complex circular (e.g. fee without fine, fee with fine, hall ticket date, theory exam, viva).
- Flags ambiguous or incomplete dates with `is_uncertain: true` and actionable explanations.
- Generates bilingual / regional summaries in **Kannada (ಕನ್ನಡ)** and **Hindi (हिंदी)** alongside English.

### 4. Interactive Event Review & Confirmation
- Inline editing for event title, date, time, deadline cutoff, priority, venue, and description.
- **Conflict & Duplicate Detection**: Warns if two exams are scheduled on the same date or if a duplicate event already exists.
- Customizable reminder intervals (e.g. 7 days, 3 days, 1 day before).

### 5. Calendar Management & ICS Export
- **Export Standards**: Generates RFC 5545 `.ics` calendar files compatible with Apple Calendar, Microsoft Outlook, and Google Calendar.
- **1-Click Google Calendar**: Direct URL launcher with pre-filled title, time, location, and description.
- **Downloadable Weekly Summary**: Printable formatted schedule summary.
- **Interactive Month Grid**: Filter by Category (*Exam, Assignment, Registration, Event*) and Priority (*Urgent, Important, Normal*).

### 6. Smart Reminders & Overdue Tracking
- Browser-based deadline countdowns (approaching in 24 hours, due within 7 days, overdue).
- Interactive completion checklist with `localStorage` persistence.
- Standard Web Notifications API support for desktop alerts.

### 7. Notice Processing History
- Audit log of all ingested notices with timestamps, extracted event counts, and multilingual summaries.
- Search and delete operations with automatic synchronization.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **AI Processing**: Google Gemini API (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`)
- **PDF Engine**: PDF.js (`pdfjs-dist`)
- **Calendar Standard**: RFC 5545 iCalendar (`.ics`)
- **Storage**: Dual-layer (Supabase PostgreSQL cloud sync + browser `localStorage` offline cache)
- **Database Client**: `@supabase/supabase-js`
- **Deployment**: Vercel Serverless Functions (`/api/extract`)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd hackathon
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> Get a free API key at [Google AI Studio](https://aistudio.google.com/).

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note on Local Development**: NoticeFlow AI includes a built-in Vite dev-server connect middleware for `/api/extract`. When running `npm run dev`, it processes real Gemini AI requests using your `.env` key without requiring the Vercel CLI!

---

## 🚢 Vercel Deployment

NoticeFlow AI is configured for one-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub or GitLab.
2. Import the project into Vercel.
3. In the Vercel project settings, add the Environment Variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key
4. Click **Deploy**.

The repository includes `vercel.json` and a serverless endpoint at `api/extract.js`.

---

## 🧪 Testing and Demo Mode

If you test the application without setting a server API key:
- NoticeFlow AI automatically alerts the user and provides a **1-Click Demo Mode** with pre-parsed golden notice datasets.
- Users can also enter a temporary session API key directly in **Settings** (top right gear icon) without restarting the server.
- Click **"Try Sample Notice"** on the Dashboard or Upload page to test the complete workflow in seconds.

---

## 📄 License
MIT License. Built for the Hackathon.
