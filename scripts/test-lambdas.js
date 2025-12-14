const http = require('http');

const QUERIES_PORT = 9000;
const MUTATIONS_PORT = 9001;
const PATH = '/2015-03-31/functions/function/invocations';

const colors = {
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

function makeRequest(port, payload) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: PATH,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve(data);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify(payload));
        req.end();
    });
}

async function runTests() {
    console.log(`${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Testing Docker Lambda Functions       ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

    console.log(`${colors.yellow}⏳ Waiting 2 seconds for services...${colors.reset}`);
    await new Promise(r => setTimeout(r, 2000));

    let itemId = null;

    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue} Testing CREATE item${colors.reset}`);
        
        const createPayload = {
            info: { fieldName: "createItem" },
            arguments: { name: "Docker Test Item", description: "Created via Node.js test" }
        };
        
        const createRes = await makeRequest(MUTATIONS_PORT, createPayload);
        console.log(JSON.stringify(createRes, null, 2));

        if (createRes && createRes.id) {
            itemId = createRes.id;
            console.log(`${colors.green}✓ CREATE passed - Item ID: ${itemId}${colors.reset}\n`);
        } else {
            throw new Error("CREATE failed: No ID returned");
        }
    } catch (e) {
        console.error(`${colors.red}✗ CREATE failed: ${e.message}${colors.reset}`);
        process.exit(1);
    }

    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue} Testing LIST items${colors.reset}`);
        
        const listPayload = { info: { fieldName: "listItems" }, arguments: {} };
        const listRes = await makeRequest(QUERIES_PORT, listPayload);
        console.log(JSON.stringify(listRes, null, 2));

        if (Array.isArray(listRes) && listRes.length > 0) {
            console.log(`${colors.green}✓ LIST passed - Found ${listRes.length} item(s)${colors.reset}\n`);
        } else {
            throw new Error("LIST failed: No items found");
        }
    } catch (e) {
        console.error(`${colors.red}✗ LIST failed: ${e.message}${colors.reset}`);
        process.exit(1);
    }

    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue} Testing GET item${colors.reset}`);

        const getPayload = { info: { fieldName: "getItem" }, arguments: { id: itemId } };
        const getRes = await makeRequest(QUERIES_PORT, getPayload);
        console.log(JSON.stringify(getRes, null, 2));

        if (getRes && getRes.id === itemId) {
            console.log(`${colors.green}✓ GET passed${colors.reset}\n`);
        } else {
            throw new Error("GET failed: ID mismatch");
        }
    } catch (e) {
        console.error(`${colors.red}✗ GET failed: ${e.message}${colors.reset}`);
        process.exit(1);
    }

    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}  Testing UPDATE item${colors.reset}`);

        const updatePayload = {
            info: { fieldName: "updateItem" },
            arguments: { id: itemId, name: "Updated Docker Test", description: "Updated description" }
        };
        const updateRes = await makeRequest(MUTATIONS_PORT, updatePayload);
        console.log(JSON.stringify(updateRes, null, 2));

        if (updateRes && updateRes.name === "Updated Docker Test") {
            console.log(`${colors.green}✓ UPDATE passed${colors.reset}\n`);
        } else {
            throw new Error("UPDATE failed: Name not updated");
        }
    } catch (e) {
        console.error(`${colors.red}✗ UPDATE failed: ${e.message}${colors.reset}`);
        process.exit(1);
    }

    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}  Testing DELETE item${colors.reset}`);

        const deletePayload = { info: { fieldName: "deleteItem" }, arguments: { id: itemId } };
        const deleteRes = await makeRequest(MUTATIONS_PORT, deletePayload);
        console.log(deleteRes);

        if (deleteRes === true || deleteRes === "true") {
            console.log(`${colors.green}✓ DELETE passed${colors.reset}\n`);
        } else {
            throw new Error("DELETE failed");
        }
    } catch (e) {
        console.error(`${colors.red}✗ DELETE failed: ${e.message}${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║  ✓ All tests passed! 🎉                ║${colors.reset}`);
    console.log(`${colors.green}╚════════════════════════════════════════╝${colors.reset}`);
}

runTests();