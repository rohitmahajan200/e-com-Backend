import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middleware/file.upload.middleware.js';
upload
const productController=new ProductController()

const router = express.Router();

router.get('/',productController.getAllProducts);
router.post('/',upload.single('imgUrl'),productController.addProduct)
router.get('/filter',productController.getFilter)
router.post('/ratings',productController.postRatings)

router.get('/:id',productController.getOne)



export default router;

