const { forwardTo } = require('prisma-binding');

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
  }
};

module.exports = Query;
