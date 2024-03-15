const crypto = require("crypto")
const uuid = crypto.randomUUID();

// Extract a substring of 10 characters from the UUID
const randomString = uuid.substring(0, 12);

console.log(randomString);