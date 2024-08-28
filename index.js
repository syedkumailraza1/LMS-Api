import { connectDB } from "./src/DB/index.js";
import app from "./src/app.js";

const port = process.env.PORT || 3000;



connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send("Hello world");
    });
    app.listen(port, () => {
        console.log(`The server is live on http://localhost:${port}`);
    });
}).catch((error) => {
    console.log(`Error in db Connection: ${error}`);
});