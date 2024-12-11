export default async function handler(req, res) {

    const { url } = req.headers
    const { port } = req.headers

    const webViewData = await fetch(`https://dockermanager.automateandlearn.site/browse`, {
        method: 'POST', 
        headers: {
            'port': `${port}`,
            'url': `${url}`
        }
    })
    const resp = await webViewData.json();
    console.log(resp);
    return res.json({ webView: resp })

}