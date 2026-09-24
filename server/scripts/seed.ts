import { hashPassword } from "server/_core/auth";
import { prisma } from "../../server/db/prisma";
import { Role } from "@shared/types";
const admin = {
  email: "admin@test.test",
  password: "Admin1234",
  name: "admin",
  role: "ADMIN",
};

async () => {
  const password = await hashPassword(admin.password);

  return prisma.user.create({
    data: {
      email: admin.email,
      passwordHash: password,
      name: admin.name,
      role: admin.role as Role,
    },
  });
};
