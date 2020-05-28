//???HOW TO SERVE A HTML FILE IF ITS IN A SEPARATE DIRECTORY
import express from 'express';
import path from 'path';
import fs from 'fs';
const app = express();
const port = 8000;
const __dirname = path.resolve() // fixes __dirname issues

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes',(req,res)=>{
    res.sendFile('notes.html',{root: path.join(__dirname,'./public')});
})

app.get('/api/notes', (req,res)=>{
    fs.readFile('../db/db.json',(err,data)=>{
        let x = JSON.parse(data);
        res.json(x);
    });
})

app.post('/api/notes',(req,res)=>{
    //!!ASK HOW TO SEPARATE INTO BACK ANF FRONT FODLERS
    //HOW TO USE BREAKPOINT IN VSCODE
    let newNote = req.body;
    const random = Math.floor(Math.random() * 900);
    newNote.id = random;

    //use async await
    // import the json 
    fs.readFile('../db/db.json', (err,data) =>{
        if(err) throw err;
        // assign with unique id 
        // check if note with random id exist if not assign a the number
        let storedNotes = JSON.parse(data); 
        storedNotes.push(newNote); 
      
        fs.writeFile('../db/db.json', JSON.stringify(storedNotes), err=>{
            if(err) throw err;
        })
    })
   
    res.json(newNote);
})

app.delete('/api/notes/:id', (req,res)=>{
 let uniqueId = req.params.id;
 fs.readFile('../db/db.json', (err,data) =>{
    if(err) throw err;
    let storedNotes = JSON.parse(data); 

    let index = storedNotes.findIndex((i)=>{
        return i.id === parseInt(uniqueId);
    })
   
    console.log(index);
    
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

