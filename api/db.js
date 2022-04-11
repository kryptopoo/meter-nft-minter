const Ipfs = require('ipfs');
const OrbitDB = require('orbit-db');
const { toChecksumAddress } = require('./contracts');

const ipfsConfig = {
    repo: '/orbitdb/MeterioNftMinter',
    start: true,
    preload: {
        enabled: true
    },
    EXPERIMENTAL: {
        pubsub: true
    },
    config: {
        Addresses: {
            Swarm: [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
            ]
        }
    }
};

class Datastore {
    mappingStore;
    mintingStore;

    static async initOrbitDB() {
        try {
            // console.log('initOrbitDB config', ipfsConfig);
            const ipfs = await Ipfs.create();
            // console.log('ipfs id', await ipfs.id());

            const orbitdb = await OrbitDB.createInstance(ipfs);
            this.ipfsId = orbitdb.id;
            // console.log('orbitdb', orbitdb);

            this.mappingStore = await orbitdb.keyvalue('MeterioNftMinter.mappings');
            console.log('mappingStore', this.mappingStore.address.toString());

            this.mintingStore = await orbitdb.docs('MeterioNftMinter.mintings', { sync: true, indexBy: 'owner' });
            console.log('mintingStore', this.mintingStore.address.toString());

            // load
            await this.mappingStore.load();
            await this.mintingStore.load();
            console.log('all mappings', this.mappingStore.all);
            console.log('all mintings', this.mintingStore.get(''));
        } catch (e) {
            console.log('err', e);
        }
    }

    static getMapping(dest) {
        return this.mappingStore.get(dest);
    }

    static async addMapping(dest, src) {
        return await this.mappingStore.put(dest, src);
    }

    static async removeMapping(dest) {
        return await this.mappingStore.del(dest);
    }

    static async addMinting(ownerAddress, nftAddress, nftId) {
        await this.mintingStore.put({ _id: `${ownerAddress}:${nftAddress}:${nftId}`, owner: ownerAddress, nftAddress: nftAddress, nftId: nftId });
    }

    static async getMintings(ownerAddress) {
        const result = this.mintingStore.query((e) => toChecksumAddress(e.owner) == toChecksumAddress(ownerAddress));
        return result;
    }
}

module.exports = {
    Datastore: Datastore
};
