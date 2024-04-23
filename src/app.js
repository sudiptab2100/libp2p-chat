import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import readline from 'readline';
import { multiaddr } from '@multiformats/multiaddr';
import { stdinToStream, streamToConsole } from './stream.js';


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
        stdinToStream(stream);
        streamToConsole(stream);
    });
    
    return node;
}

const main = async () => {
    const args = process.argv.slice(2);
    var arg = null;
    if (args.length > 1) {
        console.log('Invalid command line argument.');
        process.exit(1);
    }
    else if(args.length === 1) {
        arg = args[0];
        if(arg != 'initiator') {
            console.log('Invalid argument');
            process.exit(1);
        }
    }
    const isInitiator = arg? true: false;
    if(isInitiator) console.log('Starting as an Initiator....\n');
    
    const node = await getNode();
    await node.start();
    console.log('libp2p has started');
    
    console.log('listening on addresses:');
    node.getMultiaddrs().forEach((addr) => {
        console.log(addr.toString())
    });
    
    if(isInitiator) {
        const peerNext = await question('Enter the multiaddress: ');
        const peer_multiaddress = multiaddr(peerNext);
        const stream = await node.dialProtocol(peer_multiaddress, chatProtocol);
        console.log("dialed the peer");
        console.log("stream status:", stream.status);
        stdinToStream(stream);
        streamToConsole(stream);
    }
    
    // await rl.close();
    // await stream.close();
    // await node.stop();
    // console.log('libp2p has stopped');
}

main().then().catch(console.error);