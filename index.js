import express from 'express';
import mongoose from "mongoose";
import multer from 'multer';
import {
  register,
  login,
  getMe,
  createPost,
  getPosts,
  getOnePost,
  deleteOnePost,
  updateOnePost
} from "./controllers/index.controllers.js";
import {
  loginValidator,
  postCreateValidator,
  registerValidator
} from './validations/auth.validator.js';
import checkAuthMiddleware from "./middlewares/checkAuth.middleware.js";
import checkValidationErrorsMiddleware from "./middlewares/checkValidationErrors.middleware.js";

const PORT = 3001;
const app = express();
const storage = multer.diskStorage({ // disk storage config to upload file
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({storage});

mongoose.connect('mongodb://localhost:27017/blog').then(() => {
  console.log('[OK] - mongodb connected.');
}).catch(() => console.log('[ERR] - mongodb not connected.'));

app.use(express.json()); // parse body to json
app.use('/uploads', express.static('uploads')); // provide static files

app.get('/', (req, res) => {
  res.status(200).send('hello from server!')
});

// check register validation, check if register validation had errors, register
app.post('/auth/registration', registerValidator, checkValidationErrorsMiddleware, register);
// that how validators and middlewares works
app.post('/auth/login', loginValidator, login);
app.post('/auth/me', checkAuthMiddleware, getMe);

app.get('/posts', getPosts);
app.get('/post/:id', getOnePost);
app.delete('/post/:id', checkAuthMiddleware, deleteOnePost);
app.put('/post/:id', updateOnePost); // todo checkAuthMiddleware
app.post('/posts', checkAuthMiddleware, postCreateValidator, createPost);

app.post('/upload', checkAuthMiddleware, upload.single('image'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'content uploaded.',
    url: `/uploads/${req.file.originalname}`
  });
});

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`[OK] - server listen on port: ${PORT}.`);
});