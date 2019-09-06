const { Prisma } = require('prisma-binding');

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  secret: process.env.PRISMA_SECRET,
  endpoint: process.env.PRISMA_ENDPOINT,
  debug: true,
});

module.exports = db;