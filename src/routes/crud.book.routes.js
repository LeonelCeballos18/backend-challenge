import express from "express";
import { createBook, getAllBooks, updateBook, deleteBook, searchBooksBy } from "../controllers/crud.book.controller.js";

const router = express.Router();

router.post("/new-book", createBook);
router.get("/", getAllBooks);
router.put("/:book_id", updateBook);
router.delete("/:book_id", deleteBook);
router.get("/search", searchBooksBy)

export default router;