const { hexToBytes, toHex } = require("ethereum-cryptography/utils");
const { recoverPublicKey } = require("./keys");
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

  // Initialize balance for new addresses
  setInitialBalance(address)

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const tx = {
    sender: sender,
    recipient: recipient,
    amount: amount
  };

  const pk = toHex(recoverPublicKey(tx, signature));

  //verify signature
  if ( `0x${pk}` !== sender) {
    return res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {

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
    balances[address] = 100;
  }
}
