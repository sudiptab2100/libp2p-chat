import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import readline from 'readline';
import { multiaddr } from '@multiformats/multiaddr';


const chatProtocol = "/chat/1.0.0";

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

const send = async (node, peer_multiaddress_str, msg_str) => {
    const peer_multiaddress = multiaddr(peer_multiaddress_str);
    const stream = await node.dialProtocol(peer_multiaddress, chatProtocol);
    // await stream.sink(msg_str);
    await stream.close();
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
    
    node.handle(chatProtocol, async ({ stream }) => {
        console.log(stream);
    })
    
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
    
    const peerNext = await question('Enter the multiaddress: ');
    var msg = "START";
    while (msg != "exit") {
        send(node, peerNext, msg);
        msg = await question('Enter the message: ');
    }
    rl.close();
    
    await node.stop()
    console.log('libp2p has stopped');
}

main().then().catch(console.error);