const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check current entries
  const entries = await prisma.entry.findMany();
  console.log('Current entries count:', entries.length);

  if (entries.length > 0) {
    console.log('Entries:');
    entries.forEach(e => {
      console.log(`  - ${e.id} (date: ${e.date})`);
    });

    // Delete all entries
    const result = await prisma.entry.deleteMany();
    console.log(`\nDeleted ${result.count} entries`);
  } else {
    console.log('No entries to delete');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
