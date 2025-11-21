import express from "express"
import {auth} from "../middlewares/auth.js";
import { getPublishedCreations,getAllCreations , toggleLikeCreation } from "../controllers/userController.js";

const userRouter=express.Router();

//userRouter.get('/get-user-creations',auth,getUserCreations)
userRouter.get('/get-all-creations', auth, getAllCreations);

userRouter.get('/get-published-creations',auth,getPublishedCreations)
userRouter.post('/toggle-like-creation',auth,toggleLikeCreation)

export default userRouter;