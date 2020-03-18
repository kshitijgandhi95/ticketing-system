const ticketsDocs = require ('./../db/tickets.json')
const usersDocs = require ('./../db/users.json')
module.exports = {
  async up(db, client) {
    await db.collection ('tickets').insertMany (ticketsDocs);
    await db.collection ('users').insertMany (usersDocs);

  }
};
