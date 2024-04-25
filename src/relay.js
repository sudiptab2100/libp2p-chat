import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';


const getRelayNode = async () => {
    const node = await createLibp2p({
        start: false,
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0/ws'
            ]
        },
        transports: [
            webSockets({
                filter: filters.all
            })
        ],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        services: {
            identify: identify(),
            circuitRelay: circuitRelayServer()
        }
    });
    
    node.addEventListener('peer:connect', (evt) => {
        const remotePeer = evt.detail;
        console.log('connected to: ' + remotePeer.toString());
    });
    
    node.addEventListener('self:peer:update', () => {
        console.log('relay node listening on addresses:');
        node.getMultiaddrs().forEach((addr) => {
            console.log(addr.toString())
        });
    });
    
    return node;
}

const main = async () => {
    const node = await getRelayNode();
    await node.start();
    console.log('\ncircuit relay node has started');
}

main();