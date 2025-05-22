import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const authorize = async (req : Request, res : Response, next : NextFunction) => {
    try {
        let token

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split('')[1]
        }

        if(!token) return res.status(401).json({message : 'Unauthorized'})
        
        const decoded = jwt.verify(token, ENV.JWT_SECRET)
            
        const user = await UserModel.findById(decoded.userId)

        if(!user) return res.status(401).json({message : 'Unauthorized'})

            req.user = user
            next()
    } catch (error) {
        if (error instanceof Error) {
          res.status(401).json({ message: 'Unauthorized', error: error.message });
        } else {
          res.status(401).json({ message: 'Unauthorized', error: 'Unknown error' });
        }
      }
      
}