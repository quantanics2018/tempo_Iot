

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const port = 5000;


const mongodbUrl = 'mongodb://127.0.0.1:27020/SI1?directConnection=true&serverSelectionTimeoutMS=2000';
const fs = require('fs');


const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });


// MongoDB connection and change streams
mongoose
  .connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    const db = mongoose.connection;
    const get_mac_address = fs.readFileSync('allData.json');

    //read all the mac_address form alldata.json
    const copy_of_mac_address = JSON.parse(get_mac_address);
    var collections = copy_of_mac_address.map((mac,index)=>{
      const adress = (mac.devicemacaddress).replace(/[:\-]/g, "_");
      const address=`/SI1/${mac.topicname}/${adress}`;
      return address;
    }); 

    
    io.on('connection', (socket) => {
      Promise.all(
        collections.map((collection) => {
          return db.collection(collection).find({}).toArray()
            .then((data) => {
              const key = collection.split('/').pop(); 
              return { key, data };
            }); 
        })
      )
        .then((results) => {
          const formattedData = results.reduce((acc, { key, data }) => {
            acc[key] = data;
            return acc;
          }, {});
          //emit the initial data
          socket.emit('message', formattedData);
        })
        .catch((error) => {
          console.log('Error retrieving initial data:', error);
        });
      
      
      socket.on('disconnect', () => {
        console.log("disconnect");
      });
      
    });

    // Change streams for all collections
    collections.forEach((collection) => {
      const changeStream = db.collection(collection).watch();
      changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
          const collection = change.ns.coll;
          const key = collection.split('/').pop();
          db.collection(collection)
            .find({})
            .toArray()
            .then((data) => {
              const formattedData = {
                [key]: data,
              }; 
              console.log(`Changes found in chart ${collection}`);
              io.emit('inserted_message', formattedData);
            })
            .catch((error) => {
              console.log(`Error retrieving changed data in ${collection}:`, error);
            });
        }
      });
      
    });

    //emit to alert page
    // collections.forEach((collection) => {
    //   const changeStream = db.collection(collection).watch();
    
    //   changeStream.on('change', (change) => {
    //     if (change.operationType === 'insert') {
    //       const collectionName = change.ns.coll;
    //       const key = collectionName.split('/').pop();
    //       const insertedValue = change.fullDocument; // Get the inserted document
    
    //       const formattedData = {
    //         [key]: insertedValue,
    //       };
    
    //       console.log(`Change found in ${collectionName}`);
    //       io.emit('change_alert', formattedData);
    //     }
    //   });
    // });
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err);
  });

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

