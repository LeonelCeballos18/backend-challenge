import prisma from "../prisma.js";

export const createBook = async(req, res) =>{
    const { author_id, title, genre, synopsis, publication, isbn, coverImage, pageCount } = req.body;

    if (!author_id && !title && !genre && !publication && !isbn && !pageCount) {
        return res.status(400).json({ ok: false, message: "No fields to update" });
    }

    try {

        const existingAuthor = await prisma.author.findUnique({
            where: { author_id },
        });
      
        if (!existingAuthor) { return res.status(404).json({ ok: false, message: "Author not found" }); }

        const newBook = await prisma.book.create({
            data: {
              author_id,
              title,
              genre,
              synopsis: synopsis || null,
              publication: new Date(publication),
              isbn,
              coverImage: coverImage || null,
              pageCount,
            },
        });

        res.status(201).json({ ok: true, message: "Book created successfully", newBook });
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ ok: false, message: "Failed to create book" });
    }
}

export const getAllBooks = async(req, res) =>{
    try {
        const books = await prisma.book.findMany();

        if(books.length === 0){ return res.status(404).json({ ok:false, message: "No books found" }); }

        res.status(200).json({ ok:true, message: books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ok: false, message: "Failed to fetch books"});
    }
}

export const updateBook = async(req, res) =>{
    const { book_id } = req.params;
    const { author_id, title, genre, synopsis, publication, isbn, coverImage, pageCount } = req.body;

    if (!title && !genre && !synopsis && !publication && !isbn && !coverImage && !pageCount) {
        return res.status(400).json({ ok: false, message: "No fields to update" });
    }

    try {
        const existingBook = await prisma.book.findUnique({
            where: { book_id },
        });
      
        if (!existingBook) { return res.status(404).json({ ok: false, message: "Book not found" }); }

        if (author_id && author_id !== existingBook.author_id) {
            const existingAuthor = await prisma.author.findUnique({
              where: { author_id },
            });
      
            if (!existingAuthor) { return res.status(404).json({ ok: false, message: "Author not found" }); }
        }
      
        if (isbn && isbn !== existingBook.isbn) {
            const duplicateISBN = await prisma.book.findUnique({
              where: { isbn },
            });
      
            if (duplicateISBN) {
              return res.status(400).json({ ok: false, message: `A book with this ISBN already exists: ${duplicateISBN.title} (ID: ${duplicateISBN.book_id})`,
              });
            }
        }

        const updatedBook = await prisma.book.update({
            where: { book_id },
            data: {
              author_id: author_id || existingBook.author_id,
              title: title || existingBook.title,
              genre: genre || existingBook.genre,
              synopsis: synopsis || existingBook.synopsis,
              publication: publication ? new Date(publication) : existingBook.publication,
              isbn: isbn || existingBook.isbn,
              coverImage: coverImage || existingBook.coverImage,
              pageCount: pageCount || existingBook.pageCount,
            },
        });

        res.status(201).json({ ok: true, message: "Book updated successfully", updatedBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ ok: false, message: "Failed to update book" });
    }
}

export const deleteBook = async(req, res) =>{
    const { book_id } = req.params;

    try {
        const existingBook = await prisma.book.findUnique({
            where: { book_id },
        });
      
        if (!existingBook) { return res.status(404).json({ ok: false, message: "Book not found" }); }

        await prisma.book.delete({
            where: { book_id },
        });

        res.status(200).json({ ok: true, message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ ok: false, message: "Failed to delete book" });
    }
}

export const searchBooksBy = async(req, res) =>{
    const { title, genre, author } = req.query;

    try {
        if(!title && !genre && !author){ return res.status(400).json({ ok:false, message: "No parameters given" }); }

        const books = await prisma.book.findMany({
            where: {
                title: title ? { contains: title } : undefined,
                genre: genre ? { contains: genre } : undefined,
                author: author
                    ? {
                        OR: [
                            { firstName: { contains: author } },
                            { lastName: { contains: author } },
                        ],
                    }
                : undefined,
            },
            include: { author: true },
        });

        if (books.length === 0) {
            return res.status(404).json({ ok: false, message: "No books found" });
        }
      
        res.status(200).json({ ok: true, message: books });
    } catch (error) {
        console.error("Error searching books:", error);
        res.status(500).json({ ok: false, message: "Failed to search books" });
    }
}