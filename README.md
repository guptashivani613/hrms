# HRMS — Hiring & HR Management System

A full-stack **Hiring and HR Management System** for managing employees, attendance, leave, and payroll. Separate flows for **HR admins** and **employees**, with JWT-based auth and a React + Django REST API architecture.

---

## Overview

HRMS streamlines HR operations: employee onboarding, attendance tracking, leave policies, salary setup, and payslip generation. HR gets an admin panel; employees get a self-service dashboard for profile, attendance, leave, and salary views.

---

## Features

### HR Admin

- **Authentication** — HR login, registration, forgot password, OTP
- **Employee management** — Add, update, view, list employees; profile pictures
- **Attendance** — View and manage attendance records
- **Leave policy** — Configure and add leave types
- **Salary & payroll** — Add salary, bank details, monthly salary, generate and download payslips
- **Admin panel** — User/admin management

### Employee

- **Authentication** — Employee login, forgot password, OTP
- **Dashboard** — Overview, attendance chart, meetings, absent today
- **Profile** — Personal info, education, experience, emergency contacts
- **Attendance** — View own attendance records
- **Leave** — Leave balance, submit leave requests
- **Salary** — View salary details, bank details, search and view payslips

---

## Project Structure

```
hrms/
├── backend/                 # Django REST API
│   ├── accounts/            # Auth (login, register, OTP, permissions)
│   ├── home/                # Attendance, dashboard-related models/APIs
│   ├── salary/              # Salary, bank details, payslips
│   ├── pms/                 # Project settings (settings, urls, wsgi)
│   ├── manage.py
│   ├── Pipfile
│   └── requirements.txt
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # accounts, attendance, dashboard, employee, hr_admin, etc.
│   │   ├── pages/           # Login, dashboard, leave, salary, etc.
│   │   ├── redux/           # auth slice, store
│   │   ├── router/          # App & employee template routers
│   │   ├── libs/            # apiUrls, axios interceptor, utils
│   │   └── utils/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Python** 3.10+ (recommended 3.11+)
- **Node.js** 18+ and npm
- **Pipenv** (optional): `pip install pipenv`

---

## Installation

### 1. Clone and enter repo

```bash
git clone <repository-url>
cd hrms
```

### 2. Backend setup

```bash
cd backend
```

**Option A — Pipenv**

```bash
pip install pipenv
pipenv install
pipenv shell
```

**Option B — venv + pip**

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Run migrations**

```bash
python manage.py migrate
```

**Create superuser (optional, for Django admin)**

```bash
python manage.py createsuperuser
```

**Start backend**

```bash
python manage.py runserver
```

API base: `http://127.0.0.1:8000/` (adjust if you use a different host/port).

### 3. Frontend setup

In a new terminal:

```bash
cd hrms/frontend
npm install
npm start
```

App runs at `http://localhost:3000` (or the port shown by Create React App).

### 4. First-time check

- Ensure backend is running and CORS allows the frontend origin (see `backend/pms/settings.py`).
- Use HR/Employee login credentials configured in your environment or seed data. Default demo login is often **username: admin**, **password: admin** (change in production).

---

## Configuration

- **Backend**: `backend/pms/settings.py` — `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, database, `SIMPLE_JWT` (token lifetime).
- **Frontend**: API base URL is typically set in `src/libs/apiUrls.js` or env — point it to your backend URL (e.g. `http://127.0.0.1:8000`).

For production:

- Set `DEBUG = False`, use strong `SECRET_KEY`, restrict `ALLOWED_HOSTS` and CORS.
- Use environment variables for secrets; consider WhiteNoise/CDN for static files and a proper WSGI/ASGI server (e.g. Gunicorn + Nginx).

---

## Scripts

| Context   | Command | Description |
|----------|---------|-------------|
| Backend  | `python manage.py runserver` | Run Django dev server |
| Backend  | `python manage.py migrate`  | Apply migrations |
| Frontend | `npm start`                | Dev server with HMR |
| Frontend | `npm run build`            | Production build |
| Frontend | `npm test`                 | Run tests |

---

## API Overview

- **Auth**: JWT obtain/refresh (e.g. `/api/token/`, `/api/token/refresh/`) — used by both HR and Employee flows.
- **Accounts**: Login, register, forgot password, OTP — under `accounts` app.
- **Home**: Attendance and dashboard-related endpoints — under `home` app.
- **Salary**: Salary, bank details, payslips — under `salary` app.

Exact paths are in `backend/accounts/urls.py`, `backend/home/urls.py`, `backend/salary/urls.py`, and `backend/pms/urls.py`.

---

## Default / Demo Login

For local testing, login is often:

- **Username:** `admin`  
- **Password:** `admin`  

Do not use these in production; change default credentials and enforce strong passwords.

---

## License

Proprietary / Internal — adjust as per your organization.
