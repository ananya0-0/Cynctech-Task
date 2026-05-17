# 🚀 LinkSave — AI-Powered Link Saver

<div align="center">
  <h3>AI-Driven Bookmarking App</h3>
  <p>Save any URL and get an instant AI-generated summary using Gemini Flash. Tag, search, and filter your saved links — all in a clean, dark-mode-ready interface.</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-No%20Libraries-06B6D4?style=flat-square&logo=tailwind-css)
  ![Gemini](https://img.shields.io/badge/Google%20Gemini-3.x%20Flash-orange?style=flat-square&logo=google-gemini)
</div>

---

## 📌 Project Overview
Built exclusively for the **CyncTech Full-Stack AI Engineering Intern** technical assessment. This application leverages modern full-stack patterns in Next.js 15, native Tailwind CSS rendering, and Server Actions for unified backend logic.

---

## 🛠️ Tech Stack & Architecture

| Technology | Implementation Layer | Notes |
| :--- | :--- | :--- |
| **Next.js 15 (App Router)** | Core Framework & Routing | Utilizing strict TypeScript and React Server Components (RSC). |
| **Tailwind CSS** | Frontend Styling | Built completely raw—zero component libraries used. |
| **Google Gemini API** | AI Processing Layer | Integrated via `@google/genai` or `@google/generative-ai`. |
| **Server Actions** | Core Data Pipeline | Consistent mutation state. No mixed API route endpoints. |
| **JSON File System** | Local Persistence | Local storage managed inside `data/links.json`. |

---

## ✨ Features Blueprint

<details>
<summary><b>🤖 Click to expand AI & Summarization Capabilities</b></summary>
<br>

* **AI Summarization:** Simply paste any valid URL. The system invokes the Gemini Flash instance to dynamically analyze page context and deliver a concise 2–3 sentence summary.
* **Error Resilience:** Handles API-level routing errors seamlessly with visible, actionable fallbacks on the UI.
</details>

<details>
<summary><b>💻 Click to expand Client-Side UX Features</b></summary>
<br>

* **Tag Builder:** Inline tag manager supporting creation via `Enter`, `Comma`, or `Space` (capped at 8 tags maximum). Built-in intuitive `Backspace` tracking for pop/remove navigation.
* **Search & Granular Filter:** Live-search index matching URLs, explicit summary content, or root domains. Supports quick-clicking tag elements to immediately isolate associated links.
* **Dark Mode Pipeline:** Native switch toggling that synchronizes directly with `localStorage` while safely respecting host OS configuration states.
* **Keyboard Shortcuts:** Global capture for <kbd>⌘ K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> to instantly focus the main URL input bar.
* **Toast Notification Engine:** Custom state machine managing warning, error, and success alerts that automatically transition out after 4 seconds.
</details>

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── globals.css        # Tailwind directives, CSS variables & typography
│   ├── layout.tsx         # Root application shell wrapper
│   ├── page.tsx           # Server component (coordinates direct JSON load)
│   ├── actions.ts         # Server Actions suite (Save, Delete, Re-summarize)
│   ├── HomeClient.tsx     # Master Client UI manager (State, Filter, Toast)
│   └── css.d.ts           # CSS module type declarations
├── components/
│   ├── AddLinkForm.tsx    # URL payload handler + inline tag interface
│   ├── LinkCard.tsx       # Content card presentation & hover actions
│   └── DarkModeToggle.tsx # Theme state listener
├── lib/
│   ├── gemini.ts          # Core Google Generative AI orchestration instance
│   └── store.ts           # JSON I/O File utilities (Read/Write/Delete operations)
└── types/
    └── link.ts            # Structural strict TypeScript interfaces
```
## 🚀 Setup & Installation
**1. Prerequisites**
Ensure you have Node.js 18+ installed on your local machine and an active API key from Google AI Studio.

**2. Dependency Installation**
Clone down your local workspace and install the project dependencies:

```bash
npm install
```
**3. Environment Variables**
Create a file named .env.local inside the project root directory to safely map your secrets:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```
**4. Run Development Server**
Fire up your local server instance using:

```bash
npm run dev
```
