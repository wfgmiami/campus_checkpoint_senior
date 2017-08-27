import express from 'express';
import db from '../models';
const User = db.model('user');
const Message = db.model('message');

// This router is already mounted on /users in server/app.js
const router = express.Router();

router.get('/',(req,res,next)=>{
  User.findAll()
  .then( users => res.send(users))
  .catch(next);
})

router.put('/:userId',(req,res,next)=>{
  User.update(
    { email: req.body.email },
    { where: { id: req.params.userId }}
  )
  .then( ()=> res.sendStatus(201))
})

export default router;
