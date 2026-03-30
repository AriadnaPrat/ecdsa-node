const { hexToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  [`0x01`]: 100,
  [`0x02`]: 50,
  [`0x03`]: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const tx = {
    sender: sender,
    recipient: recipient,
    amount: amount,
    signature: signature
  };
  console.log(tx);
  const pk = toHex(recoverPublicKeyFromMessage(mensaje, signature));
  balances.push([pk, amount]);

  if (pk !== sender) {
    return res.status(400).send({ message: "La firma no corresponde al emisor (sender)!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {

    //check signature
    if (!verifySignature(tx)){
      res.status(400).send({ message: "Invalid signature!" });
      return;
    }

    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
