const { forwardTo } = require("prisma-binding");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SALT_LENGTH = 10;
const RESET_TOKEN_LENGTH = 20;
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

const Mutations = {
  createItem: forwardTo("db"),
  updateItem: forwardTo("db"),
  deleteItem: forwardTo("db"),
  signUp: async (parent, args, ctx, info) => {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, SALT_LENGTH);

    try {
      const user = await ctx.db.mutation.createUser(
        { data: { ...args, email, password, permissions: { set: ["USER"] } } },
        info
      );
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie("token", token, {
        maxAge: DAY,
        httpOnly: true
      });

      return user;
    } catch (error) {
      if (error.message.includes("unique") && error.message.includes("email")) {
        throw new Error("This email is already taken.");
      }
      throw error;
    }
  },
  signIn: async (parent, { email, password }, ctx, info) => {
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error("User does not exist.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      maxAge: DAY,
      httpOnly: true
    });

    return { message: "You are now logged in!" };
  },
  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  requestPasswordReset: async(parent, { email }, ctx, info) => {
    // 1. Check if user exists
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error('User with this email does not exist.');
    }
    // 2. Create new reset token and reset date
    const resetToken = crypto.randomBytes(RESET_TOKEN_LENGTH).toString('hex');
    const resetTokenExpiry = Date.now() + DAY;

    // 3. Update the user with it
    const userUpdated = await ctx.db.mutation.updateUser({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    });

    return { message: 'You should get an email soon, read it and follow the instructions inside.' }

    // 4. Send an email
    // @TODO
  },

  resetPassword: async(parent, { email, password, confirmPassword }, ctx, info) => {
    // 1. Check is passwords match
    // 2. Check if user has expiry token and it's not outdated
    // 3. Hash the password
    // 4. Update user's password and remove reset tokens
    // 5. Create JWT and add it to cookie
    // 6. Return user?
  }
 };

module.exports = Mutations;
