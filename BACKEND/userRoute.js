// import express from 'express';
// import { loginUser,registerUser } from '../controllers/userController.js';

const express = require('express');
const { loginUser,registerUser, getConfirmationToken } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/confirm/:token",getConfirmationToken);

// export default userRouter;

module.exports = userRouter;