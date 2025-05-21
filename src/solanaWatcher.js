const web3 = require('@solana/web3.js');
const { PublicKey } = require('@solana/web3.js');
const { isRelevantTransaction } = require('./utils');
const { watched_wallets } = require('../config/wallets.json');

async function watchWallets() {
    const httpUrl = process.env.SOLANA_RPC_HTTP_URL || 'https://api.mainnet-beta.solana.com ';

    console.log("🔌 Connecting to Solana via HTTP...");

    const connection = new web3.Connection(httpUrl, 'confirmed');

    try {
        const slot = await connection.getSlot();
        console.log(`✅ Connected to Solana Cluster (Slot: ${slot})`);
    } catch (err) {
        console.error("❌ Failed to connect to Solana HTTP RPC:", err.message);
        return;
    }

    console.log("👂 Subscribing to wallet logs...");

    try {
        connection.onLogs(
            "all",
            (logs, ctx) => {
                console.log("📨 Raw logs received:", logs);

                // Optional: Check if it's from a watched wallet
                const affectedWallets = logs.accounts.map(acc => acc.toBase58());
                const isWatched = watched_wallets.some(w => affectedWallets.includes(w));

                if (isWatched) {
                    console.log("🔥 Watched wallet activity detected!", {
                        signature: logs.signature,
                        accounts: affectedWallets
                    });
                }
            },
            "finalized"
        );
    } catch (err) {
        console.error("❌ Failed to subscribe to logs:", err.message);
    }
}

module.exports = { watchWallets };