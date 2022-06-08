import {Express, Request, Response} from 'express'
import { createUserSessionHandler, getUserSessionHandler } from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import requireUser from './middleware/requireUser'
import validateResource from './middleware/validateResource'
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'

function routes(app: Express){

    app.get('/healthcheck', (req: Request, res: Response)=> {
        res.status(200).send('ok')
    })

    app.get('/', (req,res) => res.send('hello'))

    app.post('/api/users',validateResource(createUserSchema), createUserHandler)

    app.post('/api/sessions',validateResource(createSessionSchema) , createUserSessionHandler)

    app.get('/api/sessions',  getUserSessionHandler)
}

export default routes