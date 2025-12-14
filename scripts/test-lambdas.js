// scripts/test-lambdas.js
const http = require('http');

// Configuration
const QUERIES_PORT = 9000;
const MUTATIONS_PORT = 9001;
const PATH = '/2015-03-31/functions/function/invocations';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

// Helper function to make HTTP requests
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
                    // Try to parse JSON, or return raw string (like for Delete "true")
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve(data); // Return raw data if not JSON
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

    // 1️⃣ CREATE ITEM
    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}1️⃣  Testing CREATE item${colors.reset}`);
        
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

    // 2️⃣ LIST ITEMS
    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}2️⃣  Testing LIST items${colors.reset}`);
        
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

    // 3️⃣ GET ITEM
    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}3️⃣  Testing GET item${colors.reset}`);

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

    // 4️⃣ UPDATE ITEM
    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}4️⃣  Testing UPDATE item${colors.reset}`);

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

    // 5️⃣ DELETE ITEM
    try {
        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.blue}5️⃣  Testing DELETE item${colors.reset}`);

        const deletePayload = { info: { fieldName: "deleteItem" }, arguments: { id: itemId } };
        const deleteRes = await makeRequest(MUTATIONS_PORT, deletePayload);
        console.log(deleteRes);

        // Check strictly for boolean true or string "true"
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