import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding shop items...');

  // Delete existing items
  await prisma.shopItem.deleteMany();

  // Create shop items
  await prisma.shopItem.createMany({
    data: [
      // Backgrounds
      {
        id: 'bg-default',
        type: 'background',
        name: 'Dark Night',
        description: 'Classic dark theme',
        price: 0,
        imageUrl: '/backgrounds/default.jpg',
        sortOrder: 0,
      },
      {
        id: 'bg-sunset',
        type: 'background',
        name: 'Sunset Dreams',
        description: 'Warm orange and purple sunset',
        price: 30,
        imageUrl: '/backgrounds/sunset.jpg',
        sortOrder: 1,
      },
      {
        id: 'bg-ocean',
        type: 'background',
        name: 'Deep Ocean',
        description: 'Calm blue underwater vibes',
        price: 30,
        imageUrl: '/backgrounds/ocean.jpg',
        sortOrder: 2,
      },
      {
        id: 'bg-forest',
        type: 'background',
        name: 'Mystic Forest',
        description: 'Peaceful green forest',
        price: 50,
        imageUrl: '/backgrounds/forest.jpg',
        sortOrder: 3,
      },
      {
        id: 'bg-space',
        type: 'background',
        name: 'Cosmic Space',
        description: 'Stars and galaxies',
        price: 50,
        imageUrl: '/backgrounds/space.jpg',
        sortOrder: 4,
      },
    ],
  });

  console.log('✅ Shop items seeded successfully!');
  console.log('   - 5 backgrounds added');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
