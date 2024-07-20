import express from 'express';
import {fileURLToPath} from 'url'
import path from 'path'
import crypto from 'crypto'
import { exec } from 'child_process'

const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.WEBHOOK_SECRET || 'your_secret_here';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname,'./')))
app.use(express.json())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./welcome.html'))
})

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256']
    const hmac = crypto.createHmac('sha256', SECRET)
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex')
    
    if (signature === digest) {
        exec('git pull origin main && npm install && pm2 restart all', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                return res.status(500).send('Error updating repository')
            }
            console.log(`stdout: ${stdout}`)
            console.error(`stderr: ${stderr}`)
            res.status(200).send('Repository updated successfully')
        })
    } else {
        res.status(401).send('Invalid signature')
    }
})

app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
)