# 📄 Frigga.cloud Document Collaboration App

> An end‑to‑end assignment project for **Frigga.cloud** that delivers real‑time, collaborative document editing powered by **React 19**, **Express/Node**, **MySQL**, **Socket.io**, and a modern TypeScript front end.  

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss&style=flat)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&style=flat)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&style=flat)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socket.io&style=flat)
![License](https://img.shields.io/github/license/yourname/frigga-docs)


## Core Features

| # | Feature | Tech Highlights |
|---|---------|-----------------|
| 1 | **Auth** – sign‑up, sign‑in, JWT refresh, forgot‑password (email reset via **Resend**) | `jsonwebtoken`, `bcrypt` |
| 2 | **Rich‑Text Docs** – create, edit, format, save drafts | **Tiptap** editor + Zod schema validation |
| 3 | **Mentions & Tags** – @mention teammates inside any doc | Tiptap suggestion extension |
| 4 | **Real‑Time Presence & Notifications** | **Socket.io** channels, optimistic UI with React‑Query |
| 5 | **Instant Updates** – edits broadcast to all collaborators | WebSocket events, selective patching |
| 6 | **Responsive UI** — dark mode, mobile‑first design | **Tailwind v4** + CSS variables |
| 7 | **API & DB** — RESTful endpoints, relational data | **Express**, **Sequelize**, **MySQL 8** |
| 8 | **Testing & Linting** – confidence for prod hand‑off | Vitest / Jest, ESLint + Prettier |

---

## Tech Stack

| Layer | Libraries / Tools | Notes |
|-------|-------------------|-------|
| **Front‑end** | React 19 · TypeScript · Tailwind v4 · Vite · Tiptap · TanStack / React‑Query · Zod | Concurrent UI, optimistic updates |
| **Back‑end** | Node 18 · Express 4 · Sequelize · MySQL 8 · Socket.io · JsonWebToken | Scalable REST + WebSocket APIs |
| **Email** | **Resend** | Transactional password‑reset links | Recieving user verifications links |

---

## Getting Started

> **Prerequisites**: Node ≥ 18, pnpm 8, Docker (for MySQL), and a `.env` file (see below).

```bash
# 1 — Clone front-end 
https://github.com/DigitalGenius-ui/document-front-end.git

```bash
# 1 — Clone back-end 
https://github.com/DigitalGenius-ui/document-backend.git
