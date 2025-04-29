// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// http://localhost:3000/api/getBlog?lang=c&slug=tut_1


import * as fs from 'fs';

export default function handler(req, res) {
  // Set the appropriate CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    fs.readFile(`tutorialdata/${req.query.lang}/${req.query.slug}.json`, 'utf-8', (err, data) => {
      if (err) {
        res.status(500).json({ error: "No such blog found" });
      }
      res.status(200).json(JSON.parse(data));
    })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }

}
