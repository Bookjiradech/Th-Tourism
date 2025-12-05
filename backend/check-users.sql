-- ตรวจสอบ user ทั้งหมดในระบบ
SELECT id, email, role, createdAt FROM User ORDER BY id;

-- หาก user ที่ต้องการยังไม่เป็น admin ให้รัน:
-- UPDATE User SET role = 'admin' WHERE email = 'อีเมลของคุณ';
