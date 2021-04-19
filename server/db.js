const {MongoClient} = require('mongodb')
const {addIoUtilities} = require('./routes/socket')

const uri = "mongodb+srv://vraj291:test123@bugtracker.x1kzp.mongodb.net/main?retryWrites=true&w=majority";

const addNewUser = async ({user_name,room_name},io) => {

    let details = {
        room_name,
        users : []
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

    await new Promise((resolve) => {
    client.connect((err) => {
      if (err) throw err;
      const collection = client.db('main').collection("hackermann_rooms")
      collection.find({room_name}).toArray((err,result) => {
        if (err) throw err;
        if (result.length == 0){
            details.users = [user_name]
            collection.insertOne({room_name,users:[user_name]},(err,res) => {
                if (err) throw err;
                io = addIoUtilities(io,details.room_name)
                client.close()
                resolve()
            })
        }else{
            let newvals = {$set : {users : [...result[0].users,user_name]}}
            details.users = [...result[0].users,user_name]
            collection.updateOne({room_name},newvals,(err,res) => {
                if (err) throw err;
                client.close()
                resolve()
            })
        }
      })
    })
    }).then()

    return details
}

const deleteUser = async ({user_name,room_name}) => {

    let details = {
        room_name,
        users : []
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

    await new Promise((resolve) => {
    client.connect((err) => {
      if (err) throw err;
      const collection = client.db('main').collection("hackermann_rooms")
      collection.find({room_name}).toArray((err,result) => {
        if (err) throw err;
        if(result.length == 0){
            client.close()
            details = {}
            resolve()
        }else if(result[0].users.length == 1){
            collection.deleteOne({room_name}, function(err, res) {
                if (err) throw err
                client.close()
                details = {}
                resolve()
            })
        }else{
            let newvals = [...result[0].users.filter( e => e !== user_name)]
            collection.updateOne({room_name},{$set : {users : newvals}},(err,res) => {
                if (err) throw err
                client.close()
                details.users = newvals
                resolve()
            })
        }
        })
    })
    }).then()

    return details
}

module.exports = {addNewUser,deleteUser}