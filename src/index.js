import { connectDB } from "./DB/index.js";
import app from "./app.js";
const port = process.env.PORT

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`The server is live on http//localhost:${port}`); 
    })
}).catch((error)=>{
    console.log(`Error in db Connection: ${error}`);
    
})