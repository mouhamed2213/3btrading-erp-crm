import { hashPassword } from "../_core/auth";
import { closePrisma, prisma } from "../db/prisma";
import { Role } from "../../generated/prisma/client";

const admin = {
  email: "admin@test.test",
  password: "Admin1234",
  name: "admin",
};

async function main() {
  const passwordHash = await hashPassword(admin.password);

  const user = await prisma.user.upsert({
    where: { email: admin.email },
    update: {
      passwordHash,
      name: admin.name,
      role: Role.ADMIN,
    },
    create: {
      email: admin.email,
      passwordHash,
      name: admin.name,
      role: Role.ADMIN,
    },
  });

  console.log(`[Seed] Admin user ready: ${user.email}`);
}

main()
  .catch((error) => {
    console.error("[Seed] Failed:", error);
    process.exitCode = 1;
    
  })
  .finally(async () => {
    await closePrisma();
  });
