const { MongoClient } = require('mongodb');


let dbConnection;

const uri = process.env.database;
const clientOptions = {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
};

// Example of using the connection (make sure to add error handling and other necessary configurations)


const client = new MongoClient(uri, clientOptions);

function connectToDb(cb) {
    client.connect()
        .then((client) => {
            dbConnection = client.db(); // This will use the 'networking' database specified in the URI
            console.log('Connected to MongoDB successfully');
            return cb();
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB', err);
            return cb(err);
        });
}

function getDb() {
    return dbConnection;
}

module.exports = { connectToDb, getDb };
