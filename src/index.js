import express from "express";
import prisma from "./prisma.js";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authorRoutes from "./routes/crud.author.routes.js"

const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());

app.use('/api/authors', authorRoutes);

app.get("/", (req, res)=>{
    res.send("Hello world");
})

app.listen(port, async()=>{
    console.log(`Server is running on port ${port}`);
    console.log("\n---[Test db conection]---");
    try {
        await prisma.$connect();

        const author = await prisma.author.findFirst({
            orderBy: {
              author_id: 'asc',
            },
          });
        console.log(author);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});