import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const SALT_ROUNDS = 10;

// Funcion for hashing passwords
export async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.log("Error hashing password:", error.message);
    throw error;
  }
}

// Función for comparing passwords
export async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.log("Error comparing password:", error.message);
    throw error;
  }
}

// Funcion for generate JWT token
export function generateToken(payload) {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    return token;
  } catch (error) {
    console.log("Error generating token:", error.message);
    throw error;
  }
}

// Funcion for verifying JWT token
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log("Error verifying token:", error.message);
    return null;
  }
}
