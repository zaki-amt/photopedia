import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

  // 1. Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@photopedia.com' },
    update: {},
    create: {
      email: 'admin@photopedia.com',
      username: 'admin',
      name: 'Photopedia Admin',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'System Administrator & Content Curator for Photopedia platform.',
    },
  });

  // 2. Creator Users
  const elenaUser = await prisma.user.upsert({
    where: { email: 'elena@example.com' },
    update: {},
    create: {
      email: 'elena@example.com',
      username: 'elena_photos',
      name: 'Elena Rostova',
      password: hashedPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Landscape & outdoor photographer documenting natural light reflections.',
    },
  });

  const marcusUser = await prisma.user.upsert({
    where: { email: 'marcus@example.com' },
    update: {},
    create: {
      email: 'marcus@example.com',
      username: 'marcus_urban',
      name: 'Marcus Chen',
      password: hashedPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Neon street photography in Tokyo and urban architecture.',
    },
  });

  const sophiaUser = await prisma.user.upsert({
    where: { email: 'sophia@example.com' },
    update: {},
    create: {
      email: 'sophia@example.com',
      username: 'sophia_portraits',
      name: 'Sophia Martinez',
      password: hashedPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Editorial portraiture and natural light studio reflections.',
    },
  });

  console.log('✅ Accounts seeded (Admin & Creators)');

  // Clean existing posts for clean seed
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.exifData.deleteMany({});
  await prisma.moderationLog.deleteMany({});
  await prisma.post.deleteMany({});

  // 3. Create Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Alpine Horizon Glow',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden hour reflection over the alpine lake. Filtered through natural misty light 🏔️✨',
      category: 'Landscape',
      tags: 'landscape, nature, goldenhour',
      authorId: elenaUser.id,
      exif: {
        create: {
          camera: 'Sony A7IV',
          lens: '24mm f/1.4 GM',
          aperture: 'f/2.8',
          shutter: '1/1000s',
          iso: '100',
        },
      },
      comments: {
        create: [
          {
            content: 'Perfect framing! The lighting reflections are stunning.',
            userId: marcusUser.id,
          },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Tokyo Neon Nights',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'Neon reflections in downtown Tokyo after night rain. Cyberpunk vibes preserved in raw exposure 🌆',
      category: 'Urban & Street',
      tags: 'urban, tokyo, neon',
      authorId: marcusUser.id,
      exif: {
        create: {
          camera: 'Leica Q2',
          lens: '28mm f/1.7',
          aperture: 'f/1.7',
          shutter: '1/250s',
          iso: '800',
        },
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Golden Hour Portraiture',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      caption: 'Natural sunlight portrait series: Expressions of quiet confidence 📸✨ #portraiture #editorial',
      category: 'Portraits',
      tags: 'portrait, studio, light',
      authorId: sophiaUser.id,
      exif: {
        create: {
          camera: 'Canon R5',
          lens: '85mm f/1.2',
          aperture: 'f/1.4',
          shutter: '1/500s',
          iso: '160',
        },
      },
    },
  });

  // 4. Create Moderation Flag Queue item
  const postFlagged = await prisma.post.create({
    data: {
      title: 'City Center Architecture',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Unfiltered photo submission from city center.',
      category: 'Architecture',
      tags: 'city, arch',
      authorId: marcusUser.id,
      moderation: {
        create: {
          reason: 'Review requested for copyright verification',
          status: 'PENDING',
        },
      },
    },
  });

  console.log('✅ Seeded 4 photo posts with EXIF data and moderation queue');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
