const { forwardTo } = require("prisma-binding");

const Mutations = {
  createItem: forwardTo('db'),
  updateItem: forwardTo('db'),
  deleteItem: forwardTo('db'),
  // async createItem(parent, args, ctx, info) {
  //   console.log(args);
  //   const item = await ctx.db.mutation.createItem({ data: args.data });

  //   console.log(item);

  //   return item;
  // }
};

module.exports = Mutations;
