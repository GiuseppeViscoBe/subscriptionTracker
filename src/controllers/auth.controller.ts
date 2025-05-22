import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../models/customError.interface";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      const error: CustomError = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await UserModel.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign({ id: newUsers[0]._id }, ENV.JWT_SECRET, {
      expiresIn: "1h",
    });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "User created succesfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      const error: CustomError = new Error("User does not exists");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        const error : CustomError = new Error('Invalid password')
        error.statusCode = 401
        throw error
    }

    const token = jwt.sign({userId: user._id}, ENV.JWT_SECRET, {expiresIn : '1h'})

    res.status(200).json({
        success:true,
        message : 'User signed in succesfully',
        data : {
            token,
            user
        }
    })
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
