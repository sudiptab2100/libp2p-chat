import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { multiaddr } from '@multiformats/multiaddr';
import { stdinToStream, streamToConsole } from './stream.js';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';


const chatProtocol = "/chat/1.0.0";

const getNode = async () => {
    const node = await createLibp2p({
        start: false,
        addresses: {
            listen: [
                '/ip4/127.0.0.1/tcp/0'
            ]
        },
        transports: [
            tcp(),
            circuitRelayTransport()
        ],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()]
    });
    
    node.addEventListener('peer:connect', (evt) => {
        const remotePeer = evt.detail;
        console.log('connected to: ' + remotePeer.toString());
        console.log('\x1b[31m', '\nSTART CHATTING\n', '\x1b[0m');
    });
    
    node.handle(chatProtocol, async ({ stream }) => {
        stdinToStream(stream);
        streamToConsole(stream);
    });
    
    return node;
}

const main = async () => {
    const args = process.argv.slice(2);
    const parsedArgs = {};
    const validArgs = ['dial'];
    if(args.length % 2 !== 0) {
        console.log('Invalid command line arguments.');
        process.exit(1);
    }
    for(let i = 0; i < args.length; i += 2) {
        if(args[i].substring(0, 2) !== '--' || !validArgs.includes(args[i].substring(2))) {
            console.log('Invalid command line argument.');
            process.exit(1);
        }
        parsedArgs[args[i].substring(2)] = args[i + 1];
    }
    const isInitiator = parsedArgs['dial']? true: false;
    if(isInitiator) console.log('Starting as an Initiator....\n');
    
    const peer_multiaddr = parsedArgs['dial']? multiaddr(parsedArgs['dial']): null;
    
    const node = await getNode();
    await node.start();
    console.log('libp2p has started');
    
    console.log('listening on addresses:');
    node.getMultiaddrs().forEach((addr) => {
        console.log(addr.toString())
    });
    
    if(isInitiator) {
        const stream = await node.dialProtocol(peer_multiaddr, chatProtocol);
        stdinToStream(stream);
        streamToConsole(stream);
    }
    
    // await stream.close();
    // await node.stop();
    // console.log('libp2p has stopped');
}

main().then().catch(console.error);