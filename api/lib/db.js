const MongoClient = require('mongodb').MongoClient;

async function createMongoClient() {
  const url = 'mongodb://localhost:27018'
  const dbName = 'project';
  
  const dbInstance = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  });
  return dbInstance.db(dbName);
}

module.exports = createMongoClient;