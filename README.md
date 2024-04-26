# libp2p-chat

It is an end-to-end encrypted p2p terminal chat application built using **libp2p**.

## Requirements

- NodeJS (v20.10.0)

## Installation

### Clone Repo

```bash
git clone https://github.com/sudiptab2100/libp2p-chat.git
```

### Install Libraries

```bash
npm install
```

## Run The App

### Start a Node

- Command

    ```bash
    node src/app.js
    ```

- Output

    ```bash
    libp2p has started

    listening on addresses:
    /ip4/127.0.0.1/tcp/50456/p2p/12D3KooWSPiH6kBmgEC3b68x4WJ7So1bVWgrTt2A3Ac4v2eZT6P3
    /ip4/172.18.9.151/tcp/50456/p2p/12D3KooWSPiH6kBmgEC3b68x4WJ7So1bVWgrTt2A3Ac4v2eZT6P3
    /ip4/127.0.0.1/tcp/50457/ws/p2p/12D3KooWSPiH6kBmgEC3b68x4WJ7So1bVWgrTt2A3Ac4v2eZT6P3
    /ip4/172.18.9.151/tcp/50457/ws/p2p/12D3KooWSPiH6kBmgEC3b68x4WJ7So1bVWgrTt2A3Ac4v2eZT6P3
    ```

### Connect (dial) to the Node from another Node

- Command

    Copy the **multiaddr** of the node and with parameter **--dial** connect to the node.

    ```bash
    node src/app.js --dial /ip4/172.18.9.151/tcp/50457/ws/p2p/12D3KooWSPiH6kBmgEC3b68x4WJ7So1bVWgrTt2A3Ac4v2eZT6P3
    ```

- Output

    ```bash
    connected to: 12D3KooWSPiH6kBmgEC3b68x4WJ7So1bVWgrTt2A3Ac4v2eZT6P3
    ...
    ...
    listening on addresses:
    /ip4/127.0.0.1/tcp/50512/p2p/12D3KooWPjTSWLYBJN8irzSnwBVcR2pkpQbhWUtqezwKWVW3U7bC
    /ip4/172.18.9.151/tcp/50512/p2p/12D3KooWPjTSWLYBJN8irzSnwBVcR2pkpQbhWUtqezwKWVW3U7bC
    /ip4/127.0.0.1/tcp/50513/ws/p2p/12D3KooWPjTSWLYBJN8irzSnwBVcR2pkpQbhWUtqezwKWVW3U7bC
    /ip4/172.18.9.151/tcp/50513/ws/p2p/12D3KooWPjTSWLYBJN8irzSnwBVcR2pkpQbhWUtqezwKWVW3U7bC
    ```

### Connect using Circuit Relay

#### Run the **relay server**

- Command

    ```bash
    node src/relay.js
    ```

- Output

    ```bash
    circuit relay node has started
    relay node listening on addresses:
    /ip4/127.0.0.1/tcp/65174/ws/p2p/12D3KooWKft5sBtYaaKiDnHgRGWbx72MFXcJXtvpsErXXag31qVy
    /ip4/172.18.9.151/tcp/65174/ws/p2p/12D3KooWKft5sBtYaaKiDnHgRGWbx72MFXcJXtvpsErXXag31qVy
    ```

#### Connect to the relay node

Copy the **multiaddr** of the relay node and with parameter **--relay** connect to the node.

- Command

    ```bash
    node src/app.js --relay /ip4/172.18.9.151/tcp/65174/ws/p2p/12D3KooWKft5sBtYaaKiDnHgRGWbx72MFXcJXtvpsErXXag31qVy
    ```

- Output

    ```bash
    listening on addresses:
    /ip4/127.0.0.1/tcp/50422/p2p/12D3KooWNpJzPHs8Sub7JJpHEh5mfcGzWGc9wAnVJHYGwDcSZDQT
    /ip4/172.18.9.151/tcp/50422/p2p/12D3KooWNpJzPHs8Sub7JJpHEh5mfcGzWGc9wAnVJHYGwDcSZDQT
    /ip4/127.0.0.1/tcp/50423/ws/p2p/12D3KooWNpJzPHs8Sub7JJpHEh5mfcGzWGc9wAnVJHYGwDcSZDQT
    /ip4/172.18.9.151/tcp/50423/ws/p2p/12D3KooWNpJzPHs8Sub7JJpHEh5mfcGzWGc9wAnVJHYGwDcSZDQT

    listening on relay addresses:
    /ip4/127.0.0.1/tcp/65174/ws/p2p/12D3KooWKft5sBtYaaKiDnHgRGWbx72MFXcJXtvpsErXXag31qVy/p2p-circuit/p2p/12D3KooWNpJzPHs8Sub7JJpHEh5mfcGzWGc9wAnVJHYGwDcSZDQT
    /ip4/172.18.9.151/tcp/65174/ws/p2p/12D3KooWKft5sBtYaaKiDnHgRGWbx72MFXcJXtvpsErXXag31qVy/p2p-circuit/p2p/12D3KooWNpJzPHs8Sub7JJpHEh5mfcGzWGc9wAnVJHYGwDcSZDQT
    ```

Other node can dial to this node using the relay address or local address.

### Send Message

After peers are connected to each other they can now **send message** to each other just by **typing** and **clicking enter**.
