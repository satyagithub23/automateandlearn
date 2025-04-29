import * as fs from 'fs'



export default async function handler(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    try {
        let data = await fs.promises.readdir('products/')
        let allProduct = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let productFile = await fs.promises.readFile(`products/${element}`, 'utf-8')
            allProduct.push(JSON.parse(productFile))
        }
        res.status(200).json(allProduct)
    } catch (error) {
        res.status(404).json("Internal server error")
    }
}