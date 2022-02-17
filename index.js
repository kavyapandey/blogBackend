const express = require("express");
const app = express();
const cors = require ('cors');
const dotenv = require("dotenv");
const { cloudinary } = require('./utils/cloudinary');
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");


dotenv.config();
app.use(cors({
  origin : "*"
}))


app.use(express.static('public'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true}));


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


app.post('/api/upload', async (req, res) => {
    try {
        const fileData = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileData, {
            upload_preset: 'ml_default',
        });
        console.log(uploadResponse);
        res.status(200).json({photo:uploadResponse.url})
        // res.json({ msg: 'successfully uploaded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend is running.");
});