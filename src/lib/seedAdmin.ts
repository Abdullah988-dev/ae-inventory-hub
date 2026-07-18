import bcrypt from "bcryptjs";
import { User } from "@/models/User";

const DEFAULT_ADMIN_EMAIL = "abd.dev.net@shop.com";
const DEFAULT_ADMIN_PASSWORD = "shop5888";
const DEFAULT_ADMIN_NAME = "Admin";

export async function seedDefaultAdmin(): Promise<void> {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);

  await User.create({
    email: DEFAULT_ADMIN_EMAIL,
    password: hashedPassword,
    name: DEFAULT_ADMIN_NAME,
    role: "admin",
  });

  console.log("✅ Default admin created:", DEFAULT_ADMIN_EMAIL);
}