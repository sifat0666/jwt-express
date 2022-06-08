import {Request} from 'express'
import config from 'config'
import { verify } from 'jsonwebtoken'
import log from './logger'

export default function user (req: Request){
    const {cookies} = req
    
    const accessToken = cookies.accessToken

    if(!accessToken) return log.error('access token not found')

    const decoded = verify(accessToken, config.get('ats')) as any

    return decoded.userId

}