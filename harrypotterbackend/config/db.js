const mongoose = require("mongoose");
const dns = require("dns");

// Set fallback DNS servers to resolve MongoDB SRV connection string correctly on Windows/local networks
if (dns.setServers) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

require("dotenv").config()
const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.URI)
        console.log("Database is Connected")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDb