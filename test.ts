const h = new Bun.CryptoHasher("sha256");
h.update("Hello, world!");
console.log(h.digest("hex"));