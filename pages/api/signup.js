import User from "@/db_model_schema";
import mongoose from "@/db";
import crypto from 'crypto'



let algorithm = 'aes-256-ctr'
let ENCRYPTION_KEY = "Bhuga656uainhW67WGJg3tgeh3NSKBvgfshbdGaZvJHYGU+INA/vzf.tcZKLJ90D80ALX==NJVBTDRAVBZJ"
let IV_LENGTH = 16

export default async function handler(req, res) {
    if (req.method == 'POST') {
        console.log(req.body);
        const email = req.body.email
        const password = req.body.password



        if (email == null || email == '' || password == null || password == '') {
            res.status(404).json({ msg: "All fields are required" })
        } else {
            const user = await User.findOne({ email: email }).count()
            if (user > 0) {
                res.status(400).json({ msg: "Account already exists" })
            } else {
                let encryptedPassword = encrypt(`${password}`)
                try {
                    const insUser = await User.create({
                        email: email,
                        passWord: encryptedPassword
                    })
                    res.status(200).json({ msg: "Account created successfully" })
                } catch (error) {
                    res.status(500).json({ error: "Some error occurred! Please try again later." })
                }
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



