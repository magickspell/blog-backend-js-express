import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const SECRET = 'secretKey123'; // todo вынести secretKey123 в константу

export const register = async (req, res) => {
  try {
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'registration error.',
        error: errors,
      });
    }*/
    const passwordHash = bcrypt.hashSync(req.body.password, 6);
    const user = new UserModel({
      email: req.body.email,
      username: req.body.username,
      avatarUrl: req.body.avatarUrl,
      password: passwordHash
    });
    await user.save()
      .then(() => console.log('[OK] - new user saved'))
      .catch((e) => {
          console.log(`[ERR] - ${e}`);
          throw new Error(e);
        }
      );
    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      {
        expiresIn: '99h', // todo expires token
      }
    );
    const {password, ...userData} = user._doc; // delete passwordHash from answer
    return res.status(200).json({
      success: true,
      message: 'registration success.',
      user: userData,
      token: token
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'registration error.',
      error: `error: ${e}`,
    });
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({username: req.body.username});
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'auth error, wrong username.',
      });
    }
    const validPass = await bcrypt.compare(req.body.password, user._doc.password);
    if (!validPass) {
      return res.status(400).json({
        success: false,
        message: 'auth error, wrong user or password.',
      });
    }
    const token = jwt.sign(
      {
        _id: user._doc._id,
      },
      SECRET,
      {
        expiresIn: '99h', // todo expires token
      });
    return res.status(200).json({
      success: true,
      message: 'auth success.',
      token: token
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'auth error.',
      error: `error: ${e}`,
    });
  }
}

export const getMe = async (req, res) => { // todo token expires fix
  try {
    const user = await UserModel.findOne({username: req.body.username});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'auth me error, wrong username.',
      });
    }
    const {password, ...userData} = user._doc;
    return res.status(200).json({
      success: true,
      message: 'auth me ok',
      userData: userData
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'auth me error.',
      error: `error: ${e}`,
    });
  }
}