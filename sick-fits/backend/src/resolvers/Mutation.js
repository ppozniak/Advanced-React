const { forwardTo } = require("prisma-binding");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_LENGTH = 10;

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

const Mutations = {
  createItem: forwardTo('db'),
  updateItem: forwardTo('db'),
  deleteItem: forwardTo('db'),
  signUp: async (parent, args, ctx, info) => { 
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, SALT_LENGTH);

    const user = await ctx.db.mutation.createUser({ data: { ...args, email, password, permission: { set: ['USER'] } } }, info);

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      maxAge: DAY,
      httpOnly: true
    })

    return user;
  }
};

module.exports = Mutations;
