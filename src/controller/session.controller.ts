import { Request, Response } from "express";
import { createSession, findSession, updateSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
// import { signJwt } from "../utils/jwt.utils";
import config from 'config'
import { sign } from "jsonwebtoken";
import user from './../utils/deserializedUser'
import { signJwt } from "../utils/jwt.utils";


export async function createUserSessionHandler(req: Request, res: Response){

    //validate the users password
    const user = await validatePassword(req.body)



    if(!user){
        return res.status(401).send('invalid email or password')
    }

    //create a session
    const session = await createSession(user._id, req.get("user-agent") || "")

    console.log(session._id)
//  console.log("tokenTtls" , config.get('refrestTokenTtl'))
    
    const accessToken = sign(
      {...user, session: session._id}, 
      config.get('ats'), 
      {expiresIn: config.get<string>('accessTokenTtl')}
      )


    const refreshToken = sign (
      {...user, session: session._id}, 
      config.get('rts'), 
      // {expiresIn: config.get<string>('refreshTokenTtl')}
      {expiresIn: '1y'}
      )
  // const accessToken = signJwt(
  //   { ...user, session: session._id },
  //   config.get('rts'),
  //   { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  // );

  // // create a refresh token
  // const refreshToken = signJwt(
  //   { ...user, session: session._id },
  //   config.get('rts'),
  //   { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
  // );
    res.cookie("accessToken", accessToken, {
    maxAge: 1000*60*60,
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000*60*60*24*365,
    httpOnly: true,
  });



    //return access and refresh tokem
    return res.send({accessToken, refreshToken})

}

export async function getUserSessionHandler(req: Request, res: Response){

  
    const userId = res.locals.user._id


    const sessions = await findSession({user: userId, valid: true})


   res.send(sessions)
    
}


export async function deleteSessionHandler(req: Request, res: Response) {
  
  const data = res.locals.user

  // console.log('data ', data.session)

  await updateSession({ _id: data.session }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

