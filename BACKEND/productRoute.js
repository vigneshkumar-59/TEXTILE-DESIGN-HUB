// import express from 'express';
/* import { addProduct, listProduct, removeProduct } from '../controllers/productController'; */
/* import {} from '../controllers/productController'; */
// import multer from 'multer';
/* import { addProduct, listProduct, removeProduct } from '../controllers/productController'; */

const express = require('express');
const multer = require('multer');
const { addProduct, listProduct, removeProduct } = require('../controllers/productController');
const productRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

productRouter.get("/list", listProduct);
productRouter.post("/add",upload.single('image'), addProduct);
productRouter.post("/remove", removeProduct);

// export default productRouter;

module.exports = productRouter;