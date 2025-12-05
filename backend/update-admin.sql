-- อัปเดต user ที่สมัครแล้วให้เป็น admin
-- แก้ email ให้ตรงกับที่คุณสมัครไว้

UPDATE User SET role = 'admin' WHERE email = 'admin@test.com';

-- หรือใช้ ID ถ้ารู้ว่า user ID เท่าไหร่
-- UPDATE User SET role = 'admin' WHERE id = 1;

-- ตรวจสอบผลลัพธ์
SELECT id, email, role FROM User;
