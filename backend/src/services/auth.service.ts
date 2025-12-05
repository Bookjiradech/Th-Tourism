import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/passwords";

export async function register(email: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    const err: any = new Error("Email already exists");
    err.status = 400;
    throw err;
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: "user" }
  });
  
  // Generate token for auto-login after registration
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role }
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role }
  };
}

export async function makeAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
  
  await prisma.user.update({
    where: { email },
    data: { role: "admin" }
  });
  
  return {
    message: `User ${email} is now an admin. Please logout and login again.`
  };
}

export async function changePassword(email: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
  
  if (newPassword.length < 8) {
    const err: any = new Error("Password must be at least 8 characters");
    err.status = 400;
    throw err;
  }
  
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { email },
    data: { password: hashed }
  });
  
  return {
    message: `Password changed successfully for ${email}`
  };
}
