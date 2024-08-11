import { Router } from "express";
import { deleteBook, getallBooks, postBook, UpdateBook, searchBook } from "../controller/book.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Route to handle book posting with file upload
router.post("/AddBook", upload.fields([{ name: "cover", maxCount: 1 }]), postBook);
router.get("/AllBook", getallBooks);
router.post("/DeleteBook/:id", deleteBook);
router.put("/UpdateBook", UpdateBook);
router.get("/SearchBook", searchBook);

export default router;
