const { Pool } = require('pg')
const pool  = new Pool({
  user: 'brian',
  password: '12345',
  host: 'localhost',
  database: 'stock',
  port: 5432,
})
const WebSocket = require('ws')
const socket = new WebSocket('wss://ws.finnhub.io?token=c20n99qad3if82u49o10');

// Connection opened -> Subscribe
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'TSLA'}))
    // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
    // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
});

// Listen for messages
socket.addEventListener('message', function (event) {

    try{
      const data = JSON.parse(event.data);
      const n = data.length;
      const result = data.data[0];
      var d = new Date();
      var date = d.getDate();
      console.log(data);
      pool.query("INSERT INTO TSLA (d,c,p,s,t,v) VALUES ($1, $2, $3, $4, $5, $6)RETURNING id",[date,data.c,data.p,data.s,data.t,data.v], (err,res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('sucess');
        }
        //pool.end()
      })

    }
    catch(err) {
      throw err;
    }

});

// Unsubscribe
 var unsubscribe = function(symbol) {
    socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
}
