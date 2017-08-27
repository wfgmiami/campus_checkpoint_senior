import Sequelize from 'sequelize';
import db from './_db';

const User = db.define('user', {
  email: {
    type: db.Sequelize.STRING,
    allowNull: false
  },

});

export default User;
