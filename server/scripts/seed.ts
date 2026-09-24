import { hashPassword } from "../_core/auth";
import { prisma } from "../db/prisma";
import { Role } from "../../generated/prisma/client";

const admin = {
  email: "admin@test.test",
  password: "Admin1234",
  name: "admin",
  role: Role.ADMIN,
};

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: admin.email } });
  if (existing) {
    console.log(`[seed] Un compte existe déjà pour ${admin.email}, rien à faire.`);
    return;
  }

  const passwordHash = await hashPassword(admin.password);

  const user = await prisma.user.create({
    data: {
      email: admin.email,
      passwordHash,
      name: admin.name,
      role: admin.role,
    },
  });

  console.log(`[seed] Compte admin créé : ${user.email} (mot de passe : ${admin.password})`);
}

main()
  .catch(err => {
    console.error("[seed] Échec :", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
