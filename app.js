const express = require ('express');
const app = express();
let PORT = 5000;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('mongodb connected');
})

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

const morgan = require('morgan');
app.use(morgan('dev'));

const routes = require('./server/routes/route');
app.use('/api',routes);                                     // (/api) return json data

app.get('/',(req,res,next)=>{
    res.send('Hello World');
});

app.listen(PORT,()=>{
    console.log('Server Started at port: '+PORT);
})
