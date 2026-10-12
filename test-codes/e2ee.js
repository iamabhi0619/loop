// E2EE MULTI-DEVICE SIMULATION
// Demo only — NOT production-ready cryptography.

// --------------------------------------------------
// 1. Create a key pair for every device
// --------------------------------------------------

async function createDevice(name) {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  return {
    name,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

// --------------------------------------------------
// 2. Create devices
// --------------------------------------------------

const bobLaptop = await createDevice("Bob Laptop");
const bobFirefox = await createDevice("Bob Firefox");
const bobNewLaptop = await createDevice("Bob New Laptop");

const devices = [bobLaptop, bobFirefox, bobNewLaptop];

// --------------------------------------------------
// 3. Create one AES key for the message
// --------------------------------------------------

const messageKey = await crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256,
  },
  true,
  ["encrypt", "decrypt"],
);

// --------------------------------------------------
// 4. Encrypt the actual message
// --------------------------------------------------

async function encryptMessage(text, key) {
  const encoder = new TextEncoder();

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoder.encode(text),
  );

  return {
    ciphertext,
    iv,
  };
}

const encryptedMessage = await encryptMessage("Hello Bob!", messageKey);

// --------------------------------------------------
// 5. Wrap the message key for EVERY device
// --------------------------------------------------

async function wrapMessageKey(messageKey, devicePublicKey) {
  const rawKey = await crypto.subtle.exportKey("raw", messageKey);

  return crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    devicePublicKey,
    rawKey,
  );
}

const encryptedKeys = {};

for (const device of devices) {
  encryptedKeys[device.name] = await wrapMessageKey(
    messageKey,
    device.publicKey,
  );
}

// --------------------------------------------------
// This is basically what the SERVER stores
// --------------------------------------------------

const serverData = {
  message: encryptedMessage,
  keys: encryptedKeys,
};

console.log("SERVER ONLY SEES:");
console.log(serverData);

// --------------------------------------------------
// 6. Device decrypts its own message key
// --------------------------------------------------

async function decryptMessageForDevice(device, serverData) {
  // Get this device's encrypted message key
  const encryptedKey = serverData.keys[device.name];

  // Decrypt message key using device's private key
  const rawKey = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    device.privateKey,
    encryptedKey,
  );

  // Turn raw bytes back into AES key
  const messageKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    {
      name: "AES-GCM",
    },
    false,
    ["decrypt"],
  );

  // Decrypt actual message
  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: serverData.message.iv,
    },
    messageKey,
    serverData.message.ciphertext,
  );

  return new TextDecoder().decode(plaintext);
}

// --------------------------------------------------
// 7. Test ALL devices
// --------------------------------------------------

for (const device of devices) {
  const message = await decryptMessageForDevice(device, serverData);

  console.log(`${device.name}: ${message}`);
}
