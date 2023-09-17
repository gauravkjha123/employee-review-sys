import jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../lib/logger/logger.js";
import  { env } from '../env.js'

export const auth = async (req, res, next) => {
  try {
    const {   session } = req;

    if (!session || !session.token) {
      return res.redirect("/");
    }

    const { token } = session;
      const decode = jwt.verify(token, env.jwt.secret, {
        algorithms: env.jwt.algorithms,
      });

      if (!decode) {
        session.destroy();
        return res.clearCookie('session');
        return res.redirect("/");
      }
      
      const user = await User.findById(decode.id);

      if (!user) {
        session.destroy();
        res.clearCookie('session');
        return res.redirect("/");
      }
      res.locals.user = user;
      next();
    
  } catch (error) {
    session.destroy()
    logger.error(error);
    return res.redirect("/");
  }
};

// export const checkSession = async (req, res, next) => {
//   try {
//     const { session } = req;
//     if (session && session.token) {
//       const { token } = session;
//       const decode = jwt.verify(token, env.jwt.secret, {
//         algorithms: env.jwt.algorithms,
//       });
//       if (!decode) {
//         return next();;
//       }
//       let user = await User.findById(decode.id);
//       if (user){
//         res.locals.user = user;
//         return res.redirect("/review");
//         }
//       next();
//     }
//     next();
//   } catch (error) {
//     next();
//     logger.error(error);
//   }
// };