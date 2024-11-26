import prisma from "../prisma.js";

export const createAuthor = async(req, res) =>{
    const { firstName, lastName, bio, birthDate, nationality, email } = req.body;

    if (!firstName || !lastName || !birthDate || !nationality || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
    }

    if (new Date(birthDate) > new Date()) {
        return res.status(400).json({ error: 'Birth date cannot be in the future' });
    }

    try {
        const existingAuthor = await prisma.author.findUnique({
            where: { email },
        });

        if (existingAuthor) {
            return res.status(400).json({ ok: false, message: 'Author already exists' });
        }

        const author = await prisma.author.create({
            data: {
              firstName,
              lastName,
              bio: bio,
              birthDate: new Date(birthDate),
              nationality,
              email,
            },
        });

        res.status(201).json({ ok: true, message: "Author created succefully", author });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Failed to create author' });
    }
}

export const getAllAuthors = async(req, res) =>{
    try {
        const authors = await prisma.author.findMany();

        if(authors.length === 0){ return res.status(404).json({ ok:false, message: "No authors found" }); }

        res.status(200).json({ ok:true, message: authors });
    } catch (error) {
        console.error("Error fetching authors:", error);
        res.status(500).json({ok: false, message: "Failed to fetch authors"});
    }
}

export const updateAuthor = async(req, res) =>{
    const { author_id } = req.params;
    const { firstName, lastName, bio, birthDate, nationality, email } = req.body;

    if(!author_id){ return res.status(400).json({ ok:false, message: "No author given" }); }

    if (!firstName && !lastName && !bio && !birthDate && !nationality && !email) {
        return res.status(400).json({ ok: false, message: "No fields to update" });
    }

    try {
        const existingAuthor = await prisma.author.findUnique({
            where: { author_id: author_id }
        });
        
        if(!existingAuthor){ return res.status(404).json({ok: false, message: "Author not found"}); }


        const updatedAuthor = await prisma.author.update({
            where: { author_id: author_id },
            data: {
              firstName,
              lastName,
              bio,
              birthDate: birthDate ? new Date(birthDate) : undefined,
              nationality,
              email,
              updatedAt: new Date()
            },
        });

        res.status(200).json({ ok:true, message: "Author updated successfully", updatedAuthor });
    } catch (error) {
        console.error("Error updating author:", error);
        res.status(500).json({ ok: false, message: "Failed to update author" });
    }
}

export const deleteAuthor = async(req, res) =>{
    const { author_id } = req.params;
    
    try {
        const existingAuthor = await prisma.author.findUnique({
            where: { author_id: author_id }
        });
        
        if(!existingAuthor){ return res.status(404).json({ok: false, message: "Author not found"}); }

        await prisma.book.deleteMany({
            where: { author_id },
        });

        const deletedAuthor = await prisma.author.delete({
            where : { author_id: author_id }
        });

        res.status(200).json({ ok: true, message: 'Author deleted successfully', deletedAuthor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Failed to delete author' });
    }
}