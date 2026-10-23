<div align="center">

# Doc IT

**An AI-powered admin and document assistant for DTU students**

Tell it what you need, like a duplicate ID card, a transcript or a bonafide certificate. Doc IT tells you the fee, the department and the steps, gives you the right form, checks your documents with AI and books a verification slot once an admin approves.

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini%202.5%20Flash-8E75B2?logo=googlegemini&logoColor=white)
![Google Calendar](https://img.shields.io/badge/Google%20Calendar%20API-4285F4?logo=googlecalendar&logoColor=white)

Built by Team **dhu-render** (Vidit, Shaurya, Apoorva, Pranav) at the **MLH x Roundtable** hackathon

</div>

---

## The problem
University paperwork is confusing. Students don't know which form to fill in, which documents to attach, what the fee is or which office to go to. They often find out only after standing in the wrong queue.

## What Doc IT does

### For students
- **AI admin chat:** describe your problem in plain language. Doc IT identifies the request (14 types, from transcripts and hostel admission to internship NOCs) and replies with the exact fee, department, processing time and step-by-step actions.
- **Forms library:** the official DTU forms for each request, ready to download.
- **AI document check:** upload a filled form or document, and Gemini Vision checks it against the requirements. It flags missing or incorrect items and suggests fixes *before* you submit.
- **Smart tools:**
  - CGPA calculator
  - Fee calculator
  - Attendance checker
  - Eligibility checker
  - Personalised document checklist
  - Form-filling help
- **Complaints:** file a complaint and track its status by ID.
- **7 languages:** English, Hindi, Punjabi, Bengali, Telugu, Tamil and Marathi.

### For administrators
- **Admin dashboard:** review pending submissions.
- **Approve:** automatically finds the next free verification slot and creates a Google Calendar event.
- **Reject:** the admin types a short reason, and AI expands it into clear, student-friendly correction steps.
- **Rescheduling:** students can pick a new appointment slot.

---

## Architecture

```
React (Vite) client ──► FastAPI server ──► Gemini 2.5 Flash  (chat, vision checks, translation)
   /        student chat         │
   /forms   forms library        ├──► knowledge_base.json  (fees, departments, required docs)
   /admin   admin dashboard      └──► Google Calendar API  (verification slots)
```

---

## Getting started

### Backend
```bash
cd server
pip install -r requirements.txt
echo "Gemini_api_key=YOUR_KEY" > .env
python -m uvicorn main:app --reload --port 8000
```
Google Calendar booking is optional. Without credentials, the server falls back to suggesting a slot locally.

### Frontend
```bash
cd client
npm install
npm run dev
```

A `Dockerfile` is included for containerised deployment.

