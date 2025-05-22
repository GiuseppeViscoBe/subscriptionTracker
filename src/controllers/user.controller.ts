import { Request,Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { CustomError } from "../models/customError.interface";


export const getUsers = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const users = await UserModel.find({})

        res.status(200).json({success: true, data: users})
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const user = await UserModel.findById(req.params.id).select('-password')

        if(!user){
            const error : CustomError = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        res.status(200).json({success: true, data: user})
    } catch (error) {
        next(error)
    }
}