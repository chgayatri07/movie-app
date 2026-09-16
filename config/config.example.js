module.exports.connect = {
    port: process.env.port || 5050,
    dbConnectString: 'mongodb://USERNAME:PASSWORD@127.0.0.1:27017/movieapp?authSource=admin'
};