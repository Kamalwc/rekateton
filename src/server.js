import express from 'express';
import path from 'path';
import fs from 'fs';
import { finished } from 'stream';
const app = express();
const port = 8000;
const __dirname = path.resolve() // fixes __dirname issues
app.use(express.static("public")); // solves front end prob bndles veytihin in and serves as static 

// nodemon install globally ( like the C drive  npm -g nodemon )

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes',(req,res)=>{
    res.sendFile('notes.html',{root: path.join(__dirname,'./public')});
})

// get path 
app.get('/api/notes', (req,res)=>{
    fs.readFile('../db/db.json',(err,data)=>{
        let x = JSON.parse(data);
        res.json(x);
    });
})

//post path 
app.post('/api/notes',(req,res)=>{
  
    let newNote = req.body;
    const random = Math.floor(Math.random() * 900);
    newNote.id = random;

    // Practice using async await
    fs.readFile('../db/db.json', (err,data) =>{
        if(err) throw err;
        let storedNotes = JSON.parse(data); 
        storedNotes.push(newNote); 
      
        fs.writeFile('../db/db.json', JSON.stringify(storedNotes), err=>{
            if(err) throw err;
        })
    })
   
    res.json(newNote);
})

//delete path 
app.delete('/api/notes/:id', (req,res)=>{
 let uniqueId = req.params.id;
 fs.readFile('../db/db.json', (err,data) =>{
    if(err) throw err;
    let storedNotes = JSON.parse(data); 

    let index = storedNotes.findIndex((i)=>{
        return i.id === parseInt(uniqueId);
    })
   
    if(index != -1) storedNotes.splice(index,1);
  
    fs.writeFile('../db/db.json', JSON.stringify(storedNotes), err=>{
        if(err) throw err;
    })
    
    res.json(storedNotes);
})

})

app.get('*', (req,res) =>{ 
    res.sendFile('index.html',{root: path.join(__dirname,'./public')});
})
app.listen(port, ()=>{console.log('Listening on port: ' + port);
})

