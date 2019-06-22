const FILE_CACHE = "file-cache"

async function writeTextFile(filename, body) {
    const cache = await caches.open(FILE_CACHE);
    const res = new Response(`${body}`);
    console.log(`Writing cache-file ${filename}`)
    return cache.put(`${filename}`, res);
}

async function readTextFile(filename) {
    const cache = await caches.open(FILE_CACHE);
    console.log(`Reading cache-file ${filename}`)
    return cache.match(`${filename}`).then(res => res.text());
}

async function deleteFile(filename) {
    const cache = await caches.open(FILE_CACHE);
    console.log(`Deleting cache-file ${filename}`);
    return cache.delete(`${filename}`);
}

export default {
    writeTextFile,
    readTextFile,
    deleteFile,
}
