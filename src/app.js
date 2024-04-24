import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { multiaddr } from '@multiformats/multiaddr';
import { stdinToStream, streamToConsole } from './stream.js';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';


const chatProtocol = "/chat/1.0.0";

const getNode = async () => {
    const node = await createLibp2p({
        start: false,
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0/ws',
                '/ip4/0.0.0.0/tcp/0',
                '/'
            ]
        },
        transports: [
            tcp(),
            webSockets({
                filter: filters.all
            }),
            circuitRelayTransport({ discoverRelays: 1 })
        ],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        services: {
            identify: identify()
        }
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
    
    node.addEventListener('self:peer:update', () => {
        console.log('listening on addresses:');
        node.getMultiaddrs().forEach((addr) => {
            console.log(addr.toString());
        });
    });
    
    return node;
}

const main = async () => {
    const args = process.argv.slice(2);
    const parsedArgs = {};
    const validArgs = ['dial', 'relay'];
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
    const relay_addr = parsedArgs['relay']? multiaddr(parsedArgs['relay']): null;
    
    const node = await getNode();
    await node.start();
    console.log('libp2p has started');
    
    if(relay_addr) {
        await node.dial(relay_addr);
        console.log('relay connected');
    }
    
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