const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to DB");
        initDB(); // Ensure initDB is called after the connection is established
    })
    .catch((err) => {
        console.log("Failed to connect to DB", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "66bf6a6d4a46b2194ee58adf",
        }));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.log("Failed to initialize data", err);
    }
};

