
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inserindo dados iniciais...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const authorPassword = await bcrypt.hash('autor123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@febic.com.br' },
    update: {},
    create: {
      email: 'admin@febic.com.br',
      cpf: '11111111111',
      name: 'Administrador FEBIC',
      phone: '(47) 99999-9999',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const author = await prisma.user.upsert({
    where: { email: 'autor@febic.com.br' },
    update: {},
    create: {
      email: 'autor@febic.com.br',
      cpf: '22222222222', 
      name: 'João Silva',
      phone: '(47) 88888-8888',
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      isActive: true,
    },
  });

  console.log(`✅ Admin criado: ${admin.email}`);
  console.log(`✅ Autor criado: ${author.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });