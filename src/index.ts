import express, { type Request, type Response } from 'express';
import optimizeController from './controllers/optimize.controller.ts'
import path from 'path';
import multer from 'multer'
import { error } from 'console';

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
  res.render('index', {optimized:null, error:null});
});

app.post('/', upload.single("file") , async (req: Request, res: Response)=>{
  try {
    var optimized = await optimizeController.uploadFile(req, res)

    res.render('index', {optimized, error:null});
  } catch (error:any) {
    res.render('index', {optimized:null, error:error.message});
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});