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

    try {
      const user = await ctx.db.mutation.createUser({ data: { ...args, email, password, permissions: { set: ['USER'] } } }, info); 
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie('token', token, {
        maxAge: DAY,
        httpOnly: true
      })

    return user;
    } catch (error) {
      if (error.message.includes('unique') && error.message.includes('email')) {
        throw new Error('This email is already taken.');
      }
      throw error;
    }

  },
  signIn: async (parent, { email, password }, ctx, info) => {
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error('User does not exist.')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      throw new Error('Invalid password!');
    }

     const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
     ctx.response.cookie("token", token, {
       maxAge: DAY,
       httpOnly: true
     });

    return {  message: 'You are now logged in!'}
  }
};

module.exports = Mutations;
