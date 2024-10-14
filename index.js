const express= require("express");
const { connection } = require("./config/db");
const authRouter = require("./routes/auth-route");
const requestRouter = require("./routes/request-route");
const adminRouter = require("./routes/admin-route");
const bookRouter = require("./routes/book-route");

require("dotenv").config();

const app = express();

app.use(express.json());

const cors= require("cors");
app.use(cors({
    origin: "*"
}))

app.get("/", async(req, res)=>{
    try {
        res.send("Welcome To Library Manager");
    } catch (error) {
        console.log(error)
    }
})

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/requests', requestRouter);
app.use('/api/admin', adminRouter);


app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error while connecting to DB");
        console.log(error);
    }
    console.log(`Running at port ${process.env.port}`);
})