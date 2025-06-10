import { registerUser, loginUser } from "../services/auth.js";

export async function register(req, res) {
  try {
    const { username, password, role, adminCode } = req.body;

    if (role === "admin") {
      if (adminCode !== process.env.ADMIN_CODE) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin code",
        });
      }
    }

    const { user, token } = await registerUser({ username, password, role });

    res.status(201).json({
      success: true,
      message: "New user registered successfully",
      user: { username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
