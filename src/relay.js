import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';

const getRelayNode = async () => {
    const node = await createLibp2p({
        start: false,
        addresses: {
            listen: [
                '/ip4/127.0.0.1/tcp/0'
            ]
        },
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        services: {
            circuitRelay: circuitRelayServer()
        }
    });
    
    return node;
}

const node = await getRelayNode();
await node.start();
console.log('libp2p has started');

node.addEventListener('self:peer:update', () => {
    console.log('listening on addresses:');
    node.getMultiaddrs().forEach((addr) => {
        console.log(addr.toString())
    });
});