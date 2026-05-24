import express, { type Request, type Response } from 'express';
import optimizeController from './controllers/optimize.controller.ts'
import path from 'path';
import multer from 'multer'

const currentDir = import.meta.dirname;

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(currentDir + '/static'))
app.set('view engine', 'ejs');
app.set('views', path.join(currentDir, 'views'));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.post('/optimize', upload.single("file") ,optimizeController.uploadFile);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});