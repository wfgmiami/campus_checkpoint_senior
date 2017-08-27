import express from 'express';
import db from '../models';
const Message = db.model('message');
const User = db.model('user');

// This router is already mounted on /messages in server/app.js
const router = express.Router();

router.get('/to/:id', (req,res,next)=>{
  Message.findAll({
    include: [{
      model: User, as: 'to'
    },
    {
      model: User, as: 'from'
    }],
    where: { toId: req.params.id}
  })
  .then( messages => res.send(messages))
  .then(next)
})

router.get('/from/:id', (req,res,next)=>{
  Message.getAllWhereSender(req.params.id)
  // Message.getAllWhereSender({
  //   include: [{
  //     model: User, as: 'from'
  //   }],
  //   where: { fromId: req.params.id}
  // })
  .then( messages => res.send(messages))
  .catch(next)
})

router.post('/', (req,res,next)=>{
  Message.create(req.body)
  .then((message)=>res.status(201).send(message))
})

export default router;

