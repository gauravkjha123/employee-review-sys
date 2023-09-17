import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import logger from "../../lib/logger/logger.js";
import  { env } from '../../env.js'

export const auth = async (req, res, next) => {
  try {
    let authorization = req.header('Authorization');
    const {   session } = req;

    if (!session || !session.token) {
      return res.redirect("/");
    }

    const { token } = session;
    authorization=token;
    if (!authorization ) {
      logger.info('Credentials provided by the client', authorization);
      return res.status(403).json({error:'Un-authorised!'});
    }
    const user =await decode(token);
    logger.info('Credentials provided by the client', user, authorization);

    if (!user) {
      logger.info('Credentials provided by the client', authorization);
      return res.status(403).json({error:'Un-authorised!'})
    }
    req.user = user;
    next();
  } catch (error) {
    logger.info('Expired credentials provided by the client', error.message);
   return res.status(403).json({error:'Un-authorised!'})
  }
};

const decode=async (token)=>{
    try {
        const decoded = jwt.verify(token, env.jwt.secret );
        const user = await User.findById(decoded.id);
        if (user) {
            return user;
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
}