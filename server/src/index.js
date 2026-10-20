import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';

const app = express();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT;

for (let attempt = 1; attempt <= 5; attempt += 1){
    try {
        await mongoose.connect(uri)
        break

    } catch (error) {
        if (attempt == 5 )throw error
        console.warn (`MongoDB unavailable (attempt ${attempt}/5). Retrying in 3s…`)
        await new Promise((resolve) => setTimeout(resolve, 3000))
    }
}

app.listen(port, ()=>{
    console.log(`API listening on http://localhost:${port}`)
})