import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => {
    return new Promise(resolve => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
};

const getNode = async () => {
    const node = await createLibp2p({
        start: false,
        addresses: {
            listen: [
                '/ip4/127.0.0.1/tcp/0'
            ]
        },
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()]
    });
    
    return node;
}

const main = async () => {
    const node = await getNode();
    await node.start();
    console.log('libp2p has started');
    
    console.log('listening on addresses:');
    node.getMultiaddrs().forEach((addr) => {
        console.log(addr.toString())
    });
    
    const peeNext = await question('Enter the multiaddress: ');
    var msg = "";
    while (msg != "exit") {
        msg = await question('Enter the message: ');
    }
    rl.close();
    
    await node.stop()
    console.log('libp2p has stopped');
}

main().then().catch(console.error);