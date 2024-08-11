import { Book } from "../models/book.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const postBook = async (req, res) => {
    console.log("Request body:", req.body); // Log the entire request body

    // Take input from user
    const { title, author, genre } = req.body;

    // Check if all the fields are filled
    if (!title) {
        console.log("This is the title: ", title); // Log title specifically
        return res.status(400).json({ error: "Title is required" });
    }

    if (!author) {
        return res.status(400).json({ error: "Author is required" });
    }

    if (!genre) {
        return res.status(400).json({ error: "Genre is required" });
    }

    // Check if the book already exists in the database
    const existingBook = await Book.findOne({ title: title });
    if (existingBook) {
        return res.status(400).json({ error: "Book already exists" });
    }

    // Get image from user and check
    const coverLocalPath = req.files?.cover?.[0]?.path;
    if (!coverLocalPath) {
        return res.status(400).json({ message: "Cover image is required" });
    }
    console.log(coverLocalPath);

    const cover = await uploadOnCloudinary(coverLocalPath);
    if (!cover) {
        return res.status(400).json({ message: "Failed to upload cover image" });
    }

    console.log(cover);
    

    // Store the book in DB
    const book = await Book.create({
        title,
        author,
        genre,
        cover: cover
    });

    // Send the success message to the user
    res.status(201).json({
        message: "Book added successfully!",
        book
    });
}

const getallBooks = async (req,res)=>{
 
    try {
      const allBooks = await Book.find();
      res.json(allBooks);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error:', error });
      console.log(error);
  }
  }

  const deleteBook = async (req,res)=>{
    try {
        //find the book by its I'd
        const bookId = req.params.id;
        const book = await Book.findById(bookId)
        if(!book){
            return res.status(404).json({ message: "Book not found" });
        }

        //remove it
        await Book.deleteOne({ _id: bookId });
        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        console.log("error while deleting the book",error);
        
    }
  }

  const UpdateBook = async (req,res)=>{
    try {
        //get book from param
        const book = req.body 

        //check if book exist
        const Existingbook = await Book.findById(book._id);
        if(!book){
            return res.status(404).json({ message: "Book not found" });
        }

        //update
        await Book.updateOne(
            {"_id": book._id},
            {$set: book}
        )

        res.json({ message: "Book updated successfully" });
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error:', error });
      console.log(error);
    }
  }

  const searchBook = async (req,res)=>{
    try {
        // Get user input for what to search
        const search = req.body;

        // Declare the book variable
        let book;

        // Check whether the user is searching by title, author, or genre
        if (search.title) {
            book = await Book.find({ title: search.title });
        } else if (search.author) {
            book = await Book.find({ author: search.author });
        } else if (search.genre) {
            book = await Book.find({ genre: search.genre });
        } else {
            return res.status(404).json({ message: "Invalid search query" });
        }

        // Return the output
        return res.json(book);

    } 
    catch (error){
        console.log("Error While Searching a Book: ",error);
    }
  }

export { postBook, getallBooks, deleteBook, UpdateBook, searchBook };
