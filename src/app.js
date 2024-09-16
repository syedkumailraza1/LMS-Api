import express from "express";
import AdminRoute from "./route/admin.routes.js";
import UserRoute from "./route/user.routers.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import res from "express/lib/response.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Apply JSON body parser middleware only to specific routes that need it
app.use('/api/json', express.json());
app.use(express.json());
app.use(cookieParser())
const corsOptions = {
  origin: *,
  credentials: true, // This allows credentials (cookies, etc.) to be sent with the request
};

app.use(cors(corsOptions));
// Use the routes

app.use("/api/v1/admin", AdminRoute);
app.use("/api/v1/user", UserRoute);


export default app;
