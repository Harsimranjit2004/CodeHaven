import express from "express"
import cors from "cors"
import simpleGit from "simple-git"
import { generateCustomId } from "./utils"
import { getAllFilePaths } from "./file"
import path from "path"
import { uploadFile } from "./aws"
import { createClient } from "redis"
import { config } from "./config"


const subscriber = createClient();
subscriber.connect()
// Use config for Redis
const publisher = createClient({
    url: config.redis.url
});
publisher.connect();

const app = express()

app.use(cors())
app.use(express.json())

app.post("/deploy", async (req,res)=>{
    try {
        const repoUrl = req.body.repoUrl;
        const id = generateCustomId()
        await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`))
        const filePaths = await getAllFilePaths(path.join(__dirname, `output/${id}`))
        
        // Process files with error handling
        for (const file of filePaths) {
            try {
                await uploadFile(file.slice(__dirname.length+1), file);
            } catch (error) {
                console.error(`Failed to upload ${file}:`, error);
            }
        }

        await publisher.lPush("build-queue", id);
        await publisher.hSet("status", id, "uploaded")
        res.json({id: id})
    } catch (error) {
        console.error('Deploy error:', error);
        res.status(500).json({ error: 'Deployment failed' });
    }
})
app.get("/status", async (req, res)=>{
    const id  = req.query.id;
    const respone = await subscriber.hGet("status", id as string);
    res.json({
        status: respone
    })
})
app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log('Using endpoint:', config.aws.endpoint);
});