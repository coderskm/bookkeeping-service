require('dotenv').config();
const express = require('express');
const UserRouter = require("./routes/UserRouter");
const BookRouter = require("./routes/BookRouter");
const LibraryRouter = require("./routes/LibraryRouter");
const BorrowRouter = require("./routes/BorrowRouter");
const LibraryInventoryRouter = require("./routes/LibraryInventoryRouter");
const uploadRouter = require("./routes/UploadImageRouter");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log(`Connected To MongoDB !!!`))
    .catch((err) => console.log(err));

app.use("/api/users", UserRouter);
app.use("/api/books", BookRouter);
app.use("/api/libraries", LibraryRouter);
app.use("/", BorrowRouter);
app.use("/", LibraryInventoryRouter);
app.use("/", uploadRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App running on port ${port}`));
