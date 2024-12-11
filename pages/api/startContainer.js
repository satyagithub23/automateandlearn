import GLOBAL_CONSTANTS from '@/global_constants';

var jwt = require('jsonwebtoken')

const data = {
    image: "satyadocker12/cloud-ide"
};

export default async function handler(req, res) {
    const token = req.headers.token
    const { userId } = jwt.verify(token, GLOBAL_CONSTANTS.JWT_PRIVATE_KEY);
    
    try {
        let containerData = await fetch('https://dockermanager.automateandlearn.site/start-container', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'UserId': userId
            },
            body: JSON.stringify(data)
        });


        let result = await containerData.json();

        await new Promise(resolve => setTimeout(resolve, 3000));

        return res.json({ port: result.port })
    } catch (error) {
        console.error('Error:', error);
    }
}


