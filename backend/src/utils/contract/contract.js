const Web3 = require('web3');

const address = '0x916cd365fBcb89725e1269a09839356E27e36f6E'; // contract's address
const privateKey = 'f81d1d3810470affac41aa8de7b527a1536dbe50ae003922597d48e418307e55';
const providerUrl = 'https://wispy-still-orb.matic-testnet.discover.quiknode.pro/af8e1e2bf139b4a87700e520bdd7d304a8d31448/'; // RPC endpoint URL

const getContract = ()=>{
   
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    
    const abi = require('./abi.json').abi; // contract's ABI file path
   
    const contract = new web3.eth.Contract(abi, address);
    return contract
}

const getReceipts = async (id)=>{
    const contract = getContract()
    const data = await contract.methods.getReceipt(id).call()
    return data
}

const addReceipt = async (userid,pid,pname,qty,price)=>{

    const contract = getContract()
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    
    const data = contract.methods.addReceipt(userid,pid,pname,qty,price).encodeABI();

    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey.toString());
    web3.eth.accounts.wallet.add(account);

    const nonce = await web3.eth.getTransactionCount(account.address, 'pending');
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000; // gas limit

    const tx = {
    from: account.address,
    to: address,
    data: data,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey.toString());
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return txReceipt.transactionHash;
}

const closeReceipt = async (uid,index)=>{

    const contract = getContract()
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    
    const data = contract.methods.closeReceipt(uid,index).encodeABI();

    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey.toString());
    web3.eth.accounts.wallet.add(account);

    const nonce = await web3.eth.getTransactionCount(account.address, 'pending');
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000; // gas limit

    const tx = {
    from: account.address,
    to: address,
    data: data,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey.toString());
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return txReceipt.transactionHash;
}



module.exports = {getReceipts, addReceipt, closeReceipt}
