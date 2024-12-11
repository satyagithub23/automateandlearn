import * as fs from 'fs'



export default async function handler(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    try {
        fs.readFile(`products/${req.query.id}.json`, 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ error: "No such product found" });
            }
            res.status(200).json(JSON.parse(data))
        })
    } catch (error) {
        res.status(404).json({ error: "Internal Server Error" })
    }
}