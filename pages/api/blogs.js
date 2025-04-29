import * as fs from 'fs';

export default async function handler(req, res) {
    // Set the appropriate CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        let data = await fs.promises.readdir(`tutorialdata/${req.query.lang}`)
        let blogFolder = req.query.lang
        let blogFile;
        let allBlogs = [];
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            blogFile = await fs.promises.readFile(`tutorialdata/${blogFolder}/${item}`, 'utf-8')
            allBlogs.push(JSON.parse(blogFile))
        }
        res.status(200).json(allBlogs)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}