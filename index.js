import express from 'express';
import {fileURLToPath} from 'url'
import path from 'path'

const app=express();

const listen=3000;

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(express.static(path.join(__dirname,'./')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./welcome.html'))
})

app.listen(listen,()=>
    console.log(`Server is running on port ${listen}`)
)