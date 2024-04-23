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
    /ip4/127.0.0.1/tcp/51697/p2p/12D3KooWDhd6WBik8whicaK37ZUW3gkD7PosDLxAz2U1a3VMBC4S
    ```

### Connect (dial) to the Node from another Node

- Command

    Copy the **multiaddr** of the node and pass it as command line argument

    ```bash
    node src/app.js dial /ip4/127.0.0.1/tcp/51697/p2p/12D3KooWDhd6WBik8whicaK37ZUW3gkD7PosDLxAz2U1a3VMBC4S
    ```

- Output

    ```bash
    connected to: 12D3KooWDhd6WBik8whicaK37ZUW3gkD7PosDLxAz2U1a3VMBC4S
    ```

### Send Message

After peers are connected to each other they can now **send message** to each other just by **typing** and **clicking enter**.
