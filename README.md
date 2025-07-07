# Task-Github

A full-stack task management application inspired by GitHub's contribution graph. The project consists of a **NestJS** backend API and a **Next.js/React** frontend, allowing users to manage tasks, track completion, and visualize productivity.

---

## Features

- **Task Management:** Create, update, delete, and view tasks with priorities, due dates, and categories.
- **Contribution Graph:** Visualize completed tasks in a GitHub-style contribution graph.
- **Statistics:** View daily and overall task completion stats.
- **Modern UI:** Responsive, accessible, and themeable interface using Tailwind CSS and Radix UI.

---

## Project Structure

```
├── backend/   # NestJS API server
├── frontend/  # Next.js React client
```

---

## Backend (NestJS)

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **API:** RESTful endpoints for managing tasks
- **In-memory storage** (for demo; replace with DB for production)
- **Port:** `4000` (default)

### Development

```bash
cd backend
npm install
npm run start:dev
```

### API Endpoints

- `GET    /api/tasks` — List all tasks
- `GET    /api/tasks/:id` — Get a single task
- `POST   /api/tasks` — Create a new task
- `PUT    /api/tasks/:id` — Update a task
- `DELETE /api/tasks/:id` — Delete a task

---

## Frontend (Next.js/React)

- **Framework:** [Next.js](https://nextjs.org/) (React 19, TypeScript)
- **State:** Redux Toolkit
- **Styling:** Tailwind CSS, Radix UI
- **Features:** Dashboard, task list, contribution graph, statistics
- **Port:** `3000` (default)

### Development

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend API to be running at `http://localhost:4000`.

---

## Usage

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
2. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## Customization & Deployment

- **Backend:**
  - Replace in-memory storage with a database for persistence.
  - See [NestJS deployment docs](https://docs.nestjs.com/deployment) for production tips.
- **Frontend:**
  - Configure API base URL in `frontend/lib/api.ts` if deploying separately.
  - See [Next.js deployment docs](https://nextjs.org/docs/deployment) for production.

---

## License

This project is for educational/demo purposes. See individual folders for more details. 