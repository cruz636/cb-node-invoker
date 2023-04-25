const http = require('http');
const https = require('https');

const PORT = 9001;
const TARGET_URL = 'http://localhost:9000/2015-03-31/functions/function/invocations';

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        res.statusCode = 200;
        res.end();

        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log(`Sending message to target server: ${data}`);
                await postToTarget(data);
            } catch (error) {
                console.error(`Error making request to target server: ${error}`);
            }
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'POST');
        res.end('Method not allowed.');
    }
});

function postToTarget(data) {
    const postData = data;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };
    const targetUrl = new URL(TARGET_URL);
    const client = targetUrl.protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
        const req = client.request(TARGET_URL, options, res => {
            let response = '';
            res.on('data', chunk => {
                response += chunk.toString();
            });
            res.on('end', () => {
                console.log(`Response from target server: ${response}`);
                resolve();
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

server.listen(PORT, () => {
    console.log(`Server running localhost:${PORT}`);
    console.log("This server works as the first lambda. It will 'invoke' the second lambda, which is hosted in ")
    console.log(`${TARGET_URL} .`)
    console.log("Point the MODEL_BUILDER_SERVICE_URL envvar of the crowdbotics-slack-app to this server.")
});
