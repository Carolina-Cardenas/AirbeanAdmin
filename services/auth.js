import User from "../models/user.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/index.js";
import { v4 as uuid } from "uuid";

export async function registerUser({ username, password, role }) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }
  const hashedPassword = await hashPassword(password);
  const newUserId = `${role}-${uuid().substring(0, 5)}`;

  const newUser = await User.create({
    username,
    password: hashedPassword,
    role,
    userId: newUserId,
  });

  const token = generateToken(newUser);
  return { user: newUser, token };
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Contraseña incorrecta");

  const token = generateToken(user);
  return { user, token };
}
