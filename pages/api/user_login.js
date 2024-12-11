import User from "@/db_model_schema";
import mongoose from "@/db";
import crypto from 'crypto'
import GLOBAL_CONSTANTS from "@/global_constants";
var jwt = require('jsonwebtoken')

let algorithm = 'aes-256-ctr'
let ENCRYPTION_KEY = GLOBAL_CONSTANTS.ENCRYPTION_KEY
let IV_LENGTH = 16



export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://automateandlearn.site');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method == 'POST') {
        console.log(req.body);
        const email = req.body.email
        const password = req.body.password
        let encryptedPassword = encrypt(`${password}`)
        console.log(`Decrypted: ${decrypt(encryptedPassword)}`);

        if (email == null || password == null) {
            res.status(404).json({ msg: "All fields are required" })
        } else {
            const user = await User.findOne({ email: email })
            if (user) {
                let pass = user.passWord
                let decryptedPassword = decrypt(pass)
                if (password == decryptedPassword) {
                    // var token = jwt.sign({ email: user.email, pass: user.passWord }, 'HGvGHFrtfGHVtrTF%Hgt6R%e4fgvtR5ftFVRd3', { expiresIn: "1d" })
                    var token = jwt.sign({ email: user.email, pass: user.passWord, userId: user._id }, GLOBAL_CONSTANTS.JWT_PRIVATE_KEY)
                    // res.status(200).json({ msg: true, email: user.email, pass: user.passWord })
                    res.status(200).json({msg: true, token})
                } else {
                    res.status(400).json({ msg: false })    
                }
            } else {
                res.status(400).json({ msg: false })
            }
        }
    }

}


const encrypt = (text) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let key = crypto.pbkdf2Sync(ENCRYPTION_KEY, 'salt', 100000, 32, 'sha512');
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedPassword = cipher.update(text, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');
    let encryptedData = iv.toString('hex') + ':' + encryptedPassword
    console.log(encryptedData);
    return encryptedData
}

const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    // Derive the key using the master password
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, 'salt', 100000, 32, 'sha512');

    // Create a decipher object
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    // Decrypt the password
    let decryptedPassword = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedPassword += decipher.final('utf-8');

    return decryptedPassword
}