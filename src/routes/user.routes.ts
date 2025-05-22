import {Router, Response, Request} from 'express'
import { getUsers, getUser } from '../controllers/user.controller'

const userRouter = Router()

userRouter.get('/', getUsers)

userRouter.get('/:id', getUser)

userRouter.post('/', (req : Request, res : Response) => {
    
})

userRouter.put('/:id', (req : Request, res : Response) => {
    
})


userRouter.delete('/:id', (req : Request, res : Response) => {
    
})

export default userRouter