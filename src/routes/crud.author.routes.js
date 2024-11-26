import express from "express";
import { createAuthor, getAllAuthors, updateAuthor, deleteAuthor } from "../controllers/crud.author.controller.js";

const router = express.Router();

router.post("/new-author", createAuthor);
router.get("/", getAllAuthors)
router.put("/:author_id", updateAuthor);
router.delete("/:author_id", deleteAuthor);

export default router;