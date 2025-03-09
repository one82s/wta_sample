const Name = require("../model/name");

async function getUserByName(name){
    return Name.findOne({name});
}

module.exports = { getUserByName };