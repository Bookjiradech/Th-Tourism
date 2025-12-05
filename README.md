# TH-Tourism (Thailand Tourism Directory)

โปรเจคนี้เป็นระบบสำรวจและจัดการสถานที่ท่องเที่ยวในประเทศไทย โดยรวมข้อมูลจาก TAT (Thailand Tourism Directory) API และข้อมูลที่เพิ่มจากผู้ดูแล (Admin) ในฐานข้อมูลภายใน

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript + Prisma + MySQL
- Auth: JWT + bcryptjs

---

## โครงสร้างโปรเจค (สรุป)

- `backend/` — Express server, Prisma schema, API routes
- `frontend/th-tourism-frontend/` — React app (Vite)
- `backend/prisma/schema.prisma` — Database schema
- `backend/prisma/migrations/` — Prisma migrations

---

## ความสามารถหลัก

- แผนที่ประเทศไทย (SVG) คลิกเลือกจังหวัดได้
- ค้นหาและแสดงสถานที่จาก TAT API + ข้อมูล local (ที่ Admin เพิ่ม)
- ระบบสมัคร/เข้าสู่ระบบ (JWT)
- รายการโปรด (Favorites) — เก็บข้อมูลสถานที่เต็ม (ชื่อ, รายละเอียด, รูป, จังหวัด ฯลฯ)
- ระบบ Admin สำหรับเพิ่ม/แก้ไข/ลบสถานที่ และข้อมูลจะปรากฎบนหน้า Explore เป็นอันดับแรก

---

## การติดตั้ง (เครื่องพัฒนา)

ก่อนเริ่มให้ติดตั้ง Node.js (รุ่นแนะนำ >= 18) และ MySQL

1. เปิด terminal แล้วติดตั้ง dependencies ของ backend

```powershell
cd C:\File\TH-TOURISM\backend
npm install
```

2. ติดตั้ง dependencies ของ frontend

```powershell
cd C:\File\TH-TOURISM\frontend\th-tourism-frontend
npm install
```

---

## ตัวแปร environment ที่สำคัญ

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend/` และกำหนดค่าดังนี้ (ตัวอย่าง):

```ini
DATABASE_URL=mysql://root:password@localhost:3306/th_tourism
PORT=3000
JWT_SECRET=your_jwt_secret_here
TTD_API_KEY=your_tat_api_key
TTD_SECRET_KEY=your_tat_secret_key
TTD_DEFAULT_LANG=th
```

- `DATABASE_URL` — เชื่อมต่อ MySQL
- `PORT` — พอร์ตของ backend (ค่าเริ่มต้นใน repo: `3000`)
- `JWT_SECRET` — คีย์สำหรับ sign JWT
- `TTD_API_KEY`, `TTD_SECRET_KEY` — สำหรับเรียก TAT API (ถ้ามี)

---

## ตั้งค่า database (Prisma)

1. สร้างฐานข้อมูล MySQL ชื่อ `th_tourism` (หรือชื่อที่ตั้งใน `DATABASE_URL`)
2. รัน migration เพื่อสร้างตาราง

```powershell
cd C:\File\TH-TOURISM\backend
npx prisma migrate deploy
# หรือ สำหรับ dev
npx prisma migrate dev --name init
```

3. สร้าง Prisma client (จะเกิดขึ้นโดยอัตโนมัติเมื่อรัน migrate) แต่ถ้าต้องการแยก:

```powershell
npx prisma generate
```

---

## รันเซิร์ฟเวอร์สำหรับพัฒนา

- รัน backend (PowerShell):

```powershell
cd C:\File\TH-TOURISM\backend
npm run dev
# หรือ ใช้ batch ที่เตรียมไว้
start-backend.bat
```

- รัน frontend (PowerShell):

```powershell
cd C:\File\TH-TOURISM\frontend\th-tourism-frontend
npm run dev
# เปิด http://localhost:5173
```

> Backend ปกติถูกตั้งให้ฟังที่ `http://localhost:3000` และ frontend เรียก API ผ่าน `http://localhost:3000/api` (ปรับค่าใน `VITE_API_BASE` ถ้าต้องการ)

---

## Admin user
username : admin@test.com
password : password

