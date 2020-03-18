const config = {
  mongodb: {
    url: "mongodb://localhost:27017",

    databaseName: "ticketSys",

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",

  changelogCollectionName: "changelog"
};

module.exports = config;
