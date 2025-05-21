const fs = require('fs');
const path = require('path');
const { watchWallets } = require('./solanaWatcher');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

require('dotenv').config();

console.log("🐋 Starting Whale Watcher Bot...");

function promptUserToAddWallets() {
    readline.question(
        'Enter wallet address to monitor (or press Enter to finish): ',
        (input) => {
            if (input.trim() === '') {
                console.log("✅ Done adding wallets.");
                readline.close();
                watchWallets(); // Start watcher after input
                return;
            }

            const walletsFile = path.resolve(__dirname, '../config/wallets.json');
            let data = JSON.parse(fs.readFileSync(walletsFile));

            if (!data.watched_wallets.includes(input)) {
                data.watched_wallets.push(input);
                fs.writeFileSync(walletsFile, JSON.stringify(data, null, 2));
                console.log(`✅ Added wallet: ${input}`);
            } else {
                console.log(`⚠️ Wallet already exists: ${input}`);
            }

            promptUserToAddWallets(); // Repeat
        }
    );
}

promptUserToAddWallets();