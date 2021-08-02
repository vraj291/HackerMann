const {MongoClient} = require('mongodb')
const {addIoUtilities} = require('./routes/socket')

const uri = "mongodb+srv://vraj291:test123@bugtracker.x1kzp.mongodb.net/main?retryWrites=true&w=majority";

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

const addNewUser = async ({user_name,room_name},io) => {

    let details = {
        room_name,
        room_id : '',
        users : []
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

    await new Promise((resolve) => {
    client.connect((err) => {
      if (err) resolve(true);
      const collection = client.db('main').collection("hackermann_rooms")
      collection.find({room_name}).toArray((err,result) => {
        if (err) throw err;
        if (result.length == 0){
            room_id = makeid(6)
            details.users = [user_name]
            collection.insertOne({room_name,room_id,users : [user_name]},(err,res) => {
                if (err) throw err;
                console.log(room_id)
                io = addIoUtilities(io,room_id)
                client.close()
                resolve(false)
            })
        }else{
            let newvals = {$set : {users : [...result[0].users,user_name]}}
            details.users = [...result[0].users,user_name]
            collection.updateOne({room_name},newvals,(err,res) => {
                if (err) throw err;
                client.close()
                resolve(false)
            })
        }
      })
    })
    }).then(err => {
        if(err){
            details = {err : true}
        }
    })

    return details
}

const deleteUser = async ({user_name,room_name,io}) => {

    let details = {
        room_name,
        room_id : '',
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
                io.to(result.room_id).emit('updateUsers',details)
                resolve()
            })
        }
        })
    })
    }).then()

    return details
}

module.exports = {addNewUser,deleteUser}