# SkillGap AI — Dynamic Skill-to-Job Readiness & Portfolio Generator

> An AI-powered, zero-backend* career navigation dashboard that analyzes a student's
> current skills against live, search-grounded 2026 hiring benchmarks for their
> target role, generates a **job-readiness score**, an actionable **learning
> roadmap**, and an **exportable PDF portfolio report** — aligned with
> **UN SDG 8 (Decent Work & Economic Growth)**.

*\*"Zero-backend" in the sense of no database / no auth / no business services — the
only server-side piece is a thin Express + Vite dev/prod server that proxies requests
to the Gemini API.*

---

## 📌 Highlights

- 🎯 **Targeted career audit** — pick a target role, company tier (Product-Based MNC,
  Fast-Growing Startup, Service-Based IT, AI/ML Research Lab), experience level, and
  academic/location context.
- 🧮 **Dynamic job-readiness score** — proficiency-weighted (Beginner / Intermediate /
  Advanced), with tier- and experience-based adjustments.
- 📊 **Skill-gap analysis** — gaps classified as *Critical / High / Moderate*, each with
  a **market-demand reason**, a **recommended free resource**, and **estimated learning
  hours**.
- 🗓️ **Week-by-week learning roadmap** — themed weeks with core concepts, checklists,
  and a capstone deliverable per week.
- 💼 **Recruiter-ready portfolio summary** — targeted LinkedIn headline, About bio,
  quantified resume impact bullets, and a proof-of-work capstone pitch.
- 🔍 **Live search grounding** — runs with Gemini (Google Search Grounding) so
  recommendations reflect **current 2025/2026 hiring requirements**, with the search
  queries and sources cited in the output.
- 🛟 **Graceful fallback engine** — a deterministic local analyzer kicks in when no
  `GEMINI_API_KEY` is present or the API is rate-limited, so the app is fully
  functional out of the box.
- 🧪 **Interactive "what-if" simulation** — toggle skills as learned and watch the
  readiness score recalculate in real time.
- 📄 **Exportable PDF reports** — downloadable, recruit-friendly PDF with selectable
  sections (executive summary, skill gaps, roadmap, portfolio summary, market
  viability).

---

## ✨ How It Works

```
Student profile ──► SkillGap AI ──► Live 2026 market grounding (Gemini + Search)
                        │                      │
                        ▼                      ▼
          Job-Readiness Score          Structured gap analysis,
          (0–100, tier-aware)          roadmap & portfolio summary
                        │                      │
                        └──────────► Dashboard + Exportable PDF report
```

1. The student enters their **name, academic major, current skills with proficiency
   levels, target role, target company tier, experience level, and college/location
   context**.
2. The server calls **Gemini 3.8 Flash** with an expert system prompt that first uses
   **Google Search** to inspect current hiring requirements and screen filters for the
   target role/tier, then evaluates the candidate against those live standards.
3. The model returns a **structured JSON** (`readinessScore`, `skillGaps`, `roadmap`,
   `portfolioSummary`, `marketViabilityAnalysis`, `searchQueries`, `searchSources`).
4. The **Results Dashboard** visualizes the analysis, supports interactive score
   simulation, and generates a **customizable PDF portfolio report**.
5. If the Gemini call fails or no API key is configured, a **local fallback analyzer**
   computes calibrated guidance so the experience never breaks.

---

## 🧰 Tech Stack

| Layer        | Technology                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| Frontend     | React 19, TypeScript, Vite 8, Tailwind CSS 4, Motion, Lucide React         |
| Backend      | Express 4 (thin server), `tsx` runtime                                      |
| AI           | Google Gemini (`@google/genai`, `gemini-3.8-flash`) + Google Search Grounding |
| PDF reports  | jsPDF + jspdf-autotable                                                    |
| Tooling      | Bun (lockfile), TypeScript 7, Vite dev server with HMR                     |
---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.x (recommended — `bun.lock` is committed) *or* Node.js ≥ 20
  with npm
- A [Google AI Studio](https://aistudio.google.com) API key *(optional — the app runs
  with the local fallback analyzer without one)*

### 1. Install dependencies

```bash
bun install
# or: npm install
```

### 2. Configure environment

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

| Variable         | Required | Description                                                      |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `GEMINI_API_KEY` | No*      | Google AI Studio API key for live Gemini calls with search grounding. |
| `APP_URL`        | No       | Public URL where the app is hosted (used for self-referential links/callbacks). |
| `PORT`           | No       | Server port (default: `3000`).                                   |

\*Without a key, the app serves fully functional, deterministic guidance via the
built-in fallback analyzer.

### 3. Run in development

```bash
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build & run in production

```bash
bun run build        # vite build → dist/
bun run start        # serves dist/ from the Express server
```

---

## 📡 API Reference

### `GET /api/status`

Health-check and capability probe:

```json
{
  "status": "ok",
  "hasApiKey": true,
  "model": "gemini-3.8-flash"
}
```

### `POST /api/generate-career-guidance`

Generates the full skill-gap audit and career guidance. Example request body:

```json
{
  "studentName": "Aarav Sharma",
  "targetRole": "Junior Full-Stack Developer (React & Node.js)",
  "targetTier": "Product-Based MNC",
  "academicMajor": "B.Tech in Electronics & Communication",
  "currentSkills": "Python, Git, SQL",
  "skillsWithProficiency": [
    { "name": "C++", "proficiency": "Beginner" },
    { "name": "JavaScript (ES6+)", "proficiency": "Intermediate" }
  ],
  "experienceLevel": "Fresher / Entry-Level",
  "locationContext": "Tier-3 Engineering College"
}
```

Response (abridged):

```json
{
  "readinessScore": 62,
  "readinessLevel": "Moderate Bridge Needed",
  "executiveSummary": "...",
  "skillGaps": [
    {
      "skill": "React",
      "category": "framework",
      "priority": "Critical",
      "marketDemandReason": "...",
      "recommendedFreeResource": "...",
      "estimatedHoursToLearn": 40
    }
  ],
  "roadmap": [
    {
      "weekNumber": 1,
      "theme": "...",
      "coreConcepts": [],
      "checklist": [],
      "capstoneDeliverable": "...",
      "estimatedHours": 15
    }
  ],
  "portfolioSummary": "...",
  "marketViabilityAnalysis": {
    "targetRoleDemand": "...",
    "entryLevelExpectations": [],
    "sdg8ImpactNote": "..."
  },
  "searchQueries": [],
  "searchSources": [{ "title": "...", "url": "..." }]
}
```
---

## 📁 Project Structure

```
skill-gap-ai/
├── index.html                 # SPA entry (title, meta/OG tags)
├── server.ts                  # Express + Vite server, Gemini proxy, fallback logic
├── vite.config.ts             # Vite + React + Tailwind plugins, HMR/watch settings
├── tsconfig.json
├── .env.example               # GEMINI_API_KEY / APP_URL template
├── bun.lock / package.json
└── src/
    ├── main.tsx               # React root
    ├── App.tsx                # Main wizard UI (profile → audit → dashboard)
    ├── index.css
    ├── data/
    │   └── promptSpec.ts      # Prompt specs, types, defaults & fallback templates
    ├── utils/
    │   ├── fallbackAnalyzer.ts # Deterministic local guidance engine
    │   └── pdfGenerator.ts     # jsPDF report builder
    └── components/
        ├── ResultsDashboard.tsx      # Gaps / Roadmap / Portfolio tabs + PDF export
        ├── PromptDrawerModal.tsx      # Developer prompt-spec reference
        ├── LivePlaygroundView.tsx     # (template views)
        ├── PromptBlueprintView.tsx
        └── AiStudioExportView.tsx
```

---

## 🧩 Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `bun run dev`      | Start dev server (tsx + Vite middleware, HMR) |
| `bun run build`    | Production build with Vite                    |
| `bun run start`    | Serve the built `dist/` via Express           |
| `bun run lint`     | Type-check (`tsc --noEmit`)                   |

---

## 🌍 SDG 8 Alignment

This project is built for **UN Sustainable Development Goal 8 — Decent Work and
Economic Growth**. It helps talented students from tier-2/3 engineering colleges
bypass credential bias by:

- converting academic coursework into **demonstrable, market-verified skills**;
- surfacing **free learning paths** to close gaps without financial barriers;
- packaging outcomes into **recruiter-ready portfolios** that unlock decent work and
  livable compensation.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-change`).
3. Commit your changes and open a pull request.

Please keep TypeScript types and the `promptSpec.ts` schema consistent, and verify with
`bun run lint` before submitting.

---

## 📄 License

No license file is currently included in this repository. Please contact the
repository owner for usage and redistribution terms.

---

<p align="center">
  <sub>Built with 💙 for students navigating their first great job — aligned with UN SDG 8.</sub>
</p>