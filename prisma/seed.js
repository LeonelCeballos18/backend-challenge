import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear autores
  const author1 = await prisma.author.create({
    data: {
      firstName: 'J.K.',
      lastName: 'Rowling',
      bio: 'British author, best known for the Harry Potter series.',
      birthDate: new Date('1965-07-31'),
      nationality: 'British',
      email: 'jk.rowling@example.com',
      books: {
        create: [
          {
            title: "Harry Potter and the Sorcerer's Stone",
            genre: 'Fantasy',
            synopsis: 'A young wizard discovers his magical heritage.',
            publication: new Date('1997-06-26'),
            isbn: '978-0747532699',
            coverImage: 'https://example.com/hp1.jpg',
            pageCount: 309,
          },
          {
            title: "Harry Potter and the Chamber of Secrets",
            genre: 'Fantasy',
            synopsis: 'The second adventure of Harry Potter and his friends.',
            publication: new Date('1998-07-02'),
            isbn: '978-0747538493',
            coverImage: 'https://example.com/hp2.jpg',
            pageCount: 341,
          },
        ],
      },
    },
  });

  const author2 = await prisma.author.create({
    data: {
      firstName: 'George',
      lastName: 'Orwell',
      bio: 'English novelist, essayist, journalist, and critic.',
      birthDate: new Date('1903-06-25'),
      nationality: 'British',
      email: 'george.orwell@example.com',
      books: {
        create: [
          {
            title: '1984',
            genre: 'Dystopian',
            synopsis: 'A chilling prophecy about the future.',
            publication: new Date('1949-06-08'),
            isbn: '978-0451524935',
            coverImage: 'https://example.com/1984.jpg',
            pageCount: 328,
          },
          {
            title: 'Animal Farm',
            genre: 'Political satire',
            synopsis: 'A satirical tale about power and corruption.',
            publication: new Date('1945-08-17'),
            isbn: '978-0451526342',
            coverImage: 'https://example.com/animalfarm.jpg',
            pageCount: 112,
          },
        ],
      },
    },
  });

  console.log({ author1, author2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });