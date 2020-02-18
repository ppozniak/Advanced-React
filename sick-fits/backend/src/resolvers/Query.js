const { forwardTo } = require('prisma-binding');
const { loggedInGuardian, permissionsGuardian } = require("../utils");

const Query = {
  items: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  item: forwardTo('db'),
  currentUser(parent, args, ctx, info) {
    const { userId } = ctx.request;

    if (userId) {
      return ctx.db.query.user({ where: { id: userId } }, info);
    } else {
      return null;
    }
  },
  async users(parent, args, ctx, info) {
    // 1. Get the user that called the endpoint and if it's logged in
    loggedInGuardian(ctx);
    
    // 2. Check if that user has ADMIN permission to get the users
    // @TODO: Un-hardcode it if there is a way to import enums from graphql
    permissionsGuardian(ctx.request.user, ["ADMIN", "PERMISSION_UPDATE"]) 

    // 3. Return the users
    return await ctx.db.query.users({}, info);
  }
};

module.exports = Query;
