import { Request, Response } from "express";
import { createSession, findSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from 'config'
import { sign } from "jsonwebtoken";
import user from './../utils/deserializedUser'

export async function createUserSessionHandler(req: Request, res: Response){

    //validate the users password
    const user = await validatePassword(req.body)

    // console.log(user._id)

    // console.log(user)

    // console.log('user', user)

    if(!user){
        return res.status(401).send('invalid email or password')
    }

    //create a session
    const session = await createSession(user._id, req.get("user-agent") || "")

    // console.log('session' , session)
    // create an accesstoken
    // const accessToken = signJwt(
    //     {...user, session: session._id},
    //     {expiresIn: config.get('accessTokenTtl')}
    // )
    

    // //crete a refesth token
    // const refreshToken = signJwt(
    //     {...user, session: session._id},
    //     {expiresIn: config.get('refershTokenTtl')}
    // )

    // res.set('accessToken', accessToken)
    
    const accessToken = sign({userId: user._id}, config.get('ats'), {expiresIn: '15d'})
    const refreshToken = sign ({userId: user._id }, config.get('rts'), {expiresIn: '1d'})

    res.cookie("accessToken", accessToken, {
    maxAge: 300000, // 5 minu
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
  });
// //   res.setHeader('Set-Cookie', accessToken)

  // res.cookie("rt", refreshToken, {
  //   httpOnly: true,
  //   path: "/refresh_token"
  // });

  //   res.cookie("at", accessToken, {
  //   httpOnly: true,
  //   path: "/refresh_token"
  // });
    //return access and refresh tokem
    return res.send({accessToken, refreshToken})

}

export async function getUserSessionHandler(req: Request, res: Response){
    // console.log("local" ,res)
    // deserializedUser()
    const userId = user(req)
    // console.log("user_id", userId)

    const sessions = await findSession({user: userId, valid: true})

    // console.log({sessions})
   res.send(sessions)
    
}