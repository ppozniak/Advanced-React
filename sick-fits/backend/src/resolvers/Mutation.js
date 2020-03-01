const { forwardTo } = require('prisma-binding');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { transport, createEmailTemplate } = require('../services/mail');
const { loggedInGuardian, permissionsGuardian } = require("../utils");

const SALT_LENGTH = 10;
const RESET_TOKEN_LENGTH = 20;
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

function appendJWT(response, userId) {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  response.cookie("token", token, {
    maxAge: DAY * 30,
    httpOnly: true
  });
}

const Mutations = {
  createItem: async (parent, args, ctx, info) => {
    loggedInGuardian(ctx);

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args.data,
          user: {
            connect: {
              id: ctx.request.userId
            }
          }
        }
      },
      info
    );

    return item;
  },
  // @TODO: Abstract updateItem and deleteItem to remove DRYness
  updateItem: async (parent, args, ctx, info) => {
    loggedInGuardian(ctx);
   
    const item = await ctx.db.query.item({ where: {
      id: args.where.id
    }}, '{ user { id } }');

    const isUserCreator = ctx.request.user.id === item.user.id;
    const userHasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEM_UPDATE'].includes(permission));

    if (isUserCreator || userHasPermissions) {
      return ctx.db.mutation.updateItem(args, info);
    } else {
      throw new Error('You have no rights to update that item.');
    }
  },
  deleteItem: async (parent, args, ctx, info) => {
    loggedInGuardian(ctx);

    const item = await ctx.db.query.item({ where: {
      id: args.where.id
    }}, '{ user { id } }');

    const isUserCreator = ctx.request.user.id === item.user.id;
    const userHasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEM_DELETE"].includes(permission)
    );

    if (isUserCreator || userHasPermissions) {
      return ctx.db.mutation.deleteItem(args, info);
    } else {
      throw new Error("You have no rights to delete that item.");
    }
  },
  signUp: async (parent, args, ctx, info) => {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, SALT_LENGTH);

    try {
      const user = await ctx.db.mutation.createUser(
        { data: { ...args, email, password, permissions: { set: ["USER"] } } },
        info
      );

      appendJWT(ctx.response, user.id);

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
  requestPasswordReset: async (parent, { email }, ctx, info) => {
    // 1. Check if user exists
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error("User with this email does not exist.");
    }
    // 2. Create new reset token and reset date
    const resetToken = crypto.randomBytes(RESET_TOKEN_LENGTH).toString("hex");
    const resetTokenExpiry = Date.now() + DAY;

    // 3. Update the user with it
    await ctx.db.mutation.updateUser({
      where: {
        id: user.id
      },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // 4. Send an email
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?resetToken=${resetToken}&email=${email}`;
    await transport.sendMail({
      from: "inklink@noreply",
      to: email,
      subject: "Password reset request.",
      html: createEmailTemplate({
        title: "Hello there!",
        body: `
          It seems like you requested a new password.
          If that was you all you have to do is to click this link and set up a new password :)
          <p>
            <a href="${resetPasswordUrl}" target="_blank" rel="noopener">Reset your password</a>
          </p>
        `
      })
    });

    // 5. Return message
    return {
      message:
        "You should get an email soon, read it and follow the instructions inside."
    };
  },

  resetPassword: async (
    parent,
    { email, password, confirmPassword, resetToken },
    ctx,
    info
  ) => {
    // 1. Check is passwords match
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    // 2. Check if user has expiry token and it's not outdated
    const user = await ctx.db.query.user({
      where: {
        email
      }
    });

    if (!user) throw new Error("User does not exist");

    if (
      !user.resetToken ||
      !user.resetTokenExpiry ||
      resetToken !== user.resetToken
    )
      throw new Error("Invalid token");

    const now = Date.now();

    if (now > user.resetTokenExpiry) {
      throw new Error("Token expired!");
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);
    // 4. Update user's password and remove reset tokens
    const updatedUser = await ctx.db.mutation.updateUser(
      {
        where: { email },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      },
      info
    );

    // 5. Create JWT and add it to cookie
    appendJWT(ctx.response, user.id);
    // 6. Return user
    return updatedUser;
  },
  async updatePermissions(parent, {userId, permissions}, ctx, info) {
    loggedInGuardian(ctx);
    // @TODO: Un-hardcode it if there is a way to import enums from graphql
    permissionsGuardian(ctx.request.user, ["ADMIN", "PERMISSION_UPDATE"]);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        id: userId
      },
      data:{
        permissions: {
          set: permissions
        },
      }
    }, info);

    return updatedUser;
  },
  async addToCart(parent, { itemId }, ctx, info) {
    loggedInGuardian(ctx);

    // Find if the item is in cart of user already
    const [cartItem] = await ctx.db.query.cartItems({
      where: {
        user: {
          id: ctx.request.userId
        },
        item: {
          id: itemId
        }
      }
    });

    // If item is there just update the quantity
    if (cartItem) {
      return ctx.db.mutation.updateCartItem({
        data: {
          quantity: cartItem.quantity + 1,
        },
        where: {
          id: cartItem.id,
        }
      }, info);
    } else {
      // Otherwise create new CartItem
      return ctx.db.mutation.createCartItem({
        data: {
          item: {
            connect: {
              id: itemId,
            }
          },
          user: {
            connect: {
              id: ctx.request.userId,
            }
          },
        }
      }, info);
    }
  },
  async removeFromCart(parent, { cartItemId }, ctx, info) {
    loggedInGuardian(ctx);

    const cartItemToDelete = await ctx.db.query.cartItem({ where: {
      id: cartItemId,
    } }, `{ user { id } }`);

    if (cartItemToDelete.user.id !== ctx.request.userId) {
      throw new Error("You have no rights to delete that cart item.");
    } 

    return ctx.db.mutation.deleteCartItem({ where: {
      id: cartItemId,
    }}, info);
  },
};

module.exports = Mutations;
