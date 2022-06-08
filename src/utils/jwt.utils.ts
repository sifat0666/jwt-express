import config from "config";
import jwt, {verify} from "jsonwebtoken";

const publicKey = config.get<string>('public_key')
const privateKey = config.get<string>('private_key')

export function signJwt(
    object: Object,
    options?:jwt.SignOptions | undefined
){
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: 'RS256'
    })
}



export function verifyJwt(
  token: string,
  // keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
  // const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
  //   "ascii"
  // );

  try {
    const decoded = verify(token, privateKey);
    
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    // console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}