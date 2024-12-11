import GLOBAL_CONSTANTS from "@/global_constants";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://automateandlearn.site');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const data = req.body 

    try {
        console.log(data);
        let resp = await fetch(`${GLOBAL_CONSTANTS.base_url}/api/user_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        // let response = await resp.json()
        let response = await resp.json()
        console.log(response);
        return res.status(200).json({ msg: response })
    } catch (error) {
        return res.status(404).json({ error: error })
    }
}