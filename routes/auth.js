import { Router } from "express";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUser, registerUser } from "../services/users.js";

dotenv.config();
const router = Router();

// **
//  * @swagger
//  * /api/auth/register:
//  *   post:
//  *     summary: Registrera en ny användare
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [username, password, role]
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *                 example: admin
//  *     responses:
//  *       201:
//  *         description: Användare skapad
//  *       400:
//  *         description: Ogiltig registrering
//  */
router.post("/register", async (req, res) => {
  const { username, password, role, adminCode } = req.body;
  if (role === "admin" && adminCode !== process.env.ADMIN_CODE) {
    return res.status(403).json({
      success: false,
      message: "Invalid admin code",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await registerUser({
      username,
      password: hashedPassword,
      role: role || "user",
      userId: `${role || "user"}-${uuid().substring(0, 5)}`,
    });

    if (result) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to register user",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// **
//  * @swagger
//  * /api/auth/login:
//  *   post:
//  *     summary: Logga in en användare
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [username, password]
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Inloggning lyckades
//  *       400:
//  *         description: Ogiltigt användarnamn eller lösenord
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUser(username);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Successful login",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
