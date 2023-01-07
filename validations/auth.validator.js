import {body} from 'express-validator';

export const registerValidator = [
  body('email', 'email should be email type').isEmail(),
  body('password', 'password should be 6+ symbols').isLength({min: 6}),
  body('username', 'username should be 1+ symbols').isLength({min: 1}),
  body('avatarUrl').optional().isURL()
];

export const loginValidator = [
  body('password', 'password should be 6+ symbols').isLength({min: 6}),
  body('username', 'username should be 1+ symbols').isLength({min: 1})
];

export const postCreateValidator = [
  body('title', 'title should be 3+ symbols').isLength({min: 3}).isString(),
  body('text', 'text should be 6+ symbols').isLength({min: 3}).isString(),
  body('tags', 'tags should be an array').optional().isArray(),
  body('imageUrl').optional().isString()
];