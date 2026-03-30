import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey] = useState(() => {

  const savedKey = localStorage.getItem("userPrivateKey");
    if (savedKey) {
      return hexToBytes(savedKey);
    } else {
      const newKey = secp.utils.randomPrivateKey();
      localStorage.setItem("userPrivateKey", toHex(newKey));
      return newKey;
    }
  });
  console.log("privatekey: ", toHex(privateKey));
  console.log("publickey: ", toHex(secp.getPublicKey(privateKey)));

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {

      const mensaje = {
        sender: address,
        recipient: recipient,
        amount: parseInt(sendAmount),
      };

      // Sign the message
      const msgHash = keccak256(utf8ToBytes(JSON.stringify(mensaje)));
      const signature = await secp.sign(msgHash, privateKey);
      console.log("signature: ", signature);

      const response = await server.post(`send`, {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        signature: toHex(signature)
      });



      setBalance(response.data.balance);
    } catch (ex) {
      alert(ex.message);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
