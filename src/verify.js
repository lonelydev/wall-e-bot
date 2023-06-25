const crypto =  require("crypto");

const signingSecret = "0803577bf6e3c5ca1adafca4d425c19f";
const baseString = "v0:1626992929:{\"token\":\"UdG3UFNsPGoobvRzK5F2oIqe\",\"challenge\": \"6KaNtlamllYYaLZ7qhHxZbzyYut62TlDKu2wAZXp4rZlInRbcDTH\", \"type\": \"url_verification\"}";

const hmac = crypto.createHmac("sha256", signingSecret)
.update(baseString)
.digest("hex");

console.log(hmac);
