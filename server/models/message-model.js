import Sequelize from 'sequelize';
import db from './_db';
const User = db.model('user');

const Message = db.define('message', {
  subject: {
    type: db.Sequelize.STRING,
    defaultValue: 'No Subject'
  },
  body: {
    type:db.Sequelize.TEXT,
    allowNull: false
  }
},{
  classMethods: {
    getAllWhereSender: function(id){

      return Message.findAll({
        include: [{
          model: User, as: 'to'
        },
        {
          model: User, as: 'from'
        }],
        where: { fromId: id}
      })
    }
  },
  instanceMethods: {
    truncateSubject: function(num,flag){
      let newSubject = this.subject.slice(0,num);

      if(flag) newSubject = newSubject + '...'

      return {subject: newSubject, body: this.body }

    }
  }
}


);

export default Message;
