document.addEventListener("DOMContentLoaded", () => {
    

    const canvas = document.getElementById('hashCanvas');
    const ctx = canvas.getContext('2d');
    const hashR = ["bb994fe5a773521d566cfd21561a289bf876cd779a0a99acd6db1632f990406b",
        "f99bd81ce9528464c682cab18f26df66ab63e0910cfaa4a67c5437b8e6de338e",
        "18a59ac0fa387361ff3666b14bd6f94ef85065fcd3bca1a1e87d0a7705058d83",
        "90717f3a4aec5f4e47bc1e79208621c20a596f9d0a6a43eb6f05553c9f4367b7",
        "d4d284ec8704aa8092e3ff1772d6672163fd521ab2e367be0c879b747eecdc73",
        "797cd44c284efbdd8965fbc9c297cb86195601426e1e91073d76741767b1f394",
        "1d6df550fb055bb79fdabdce92206a2c8641b4202b43f5613b046390971a58ca",
        "372616f92f705af4b04c7b3ce2bd6c81e17cf17d58e4c4ac25316967abeba5e2",
        "fd7867c5ad93b4bbd0953841535db917b8954978f029346df1241878c97cb105",
        "affadc3e9d11ff14cca329f29488931032128c8d35a66a7f84afd4e73593ed0b"
];
    function getRandomHash () { return hashR[Math.floor(Math.random() * hashR.length)]; }
    const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    const hashes = [];
    const hashCount = 10;
    for (let i = 0; i < hashCount; i++) {
        hashes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            text: getRandomHash(),
            speed: 1 * 0.5 + 0.1,
            color: 'rgba(0, 255, 200, 0.5)'
        });
    }
    ctx.font = '12px "Courier New", Courier, monospace';

    const draw = () => {
        ctx.fillStyle = 'rgba(13, 13, 13, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        

        hashes.forEach(hash => {
            ctx.fillStyle = hash.color;
            ctx.fillText(hash.text, hash.x, hash.y);
            hash.y += hash.speed;

            if (hash.y > canvas.height) {
                hash.y = -20;
                hash.x = 1 * canvas.width;
                hash.text = getRandomHash();
            }
        });

        setTimeout(() => requestAnimationFrame(draw), 1000 / 5);
;
    };

    draw();
});

import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.1/dist/ethers.min.js";
import { contractABI } from './abi.js';

const contractAddress = "-";

let provider;
let signer;
let contractWithSigner;

const networks = {
    1: {
      name: 'Eth TestNet',
      shortName: 'TestNet',
      chainId: 11155111,
      network: 'ethereum',
      rpc: 'sepolia.infura.io',
      explorer: ''
    }}
    const lId = '0xaa36a7';



const inputPass = document.getElementById('inPass');
const inputValue = document.getElementById('InAmount');
const buttonReg = document.getElementById('Reg');
const depositPass = document.getElementById('DepPass');
const depositValue = document.getElementById('DepETH');
const buttonDep = document.getElementById('DepS');
const withPass = document.getElementById('WithPass');
const withAddress = document.getElementById('WithWallet');
const buttonWith = document.getElementById('WithS');
const buttonChainMain = document.getElementById('MainChain');
const connectMM = document.getElementById('connect-but');
const disConnectMM = document.getElementById('disconnect-but');

// buttonChainMain.addEventListener('click', handleChainChanged);

// async function handleChainChanged () {
//     const curentChain = await provider.getNetwork();
//     // if (!networks[chainId]) {
//     //   const chain = (await web3.getNetwork())
//     //   networks[chain.id] = chain
//     // }
//     // userChain = networks[chainId]
//     console.log(curentChain);
// }
connectMM.addEventListener('click', connectMetaMask);
async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        alert("MetaMask не найден. Пожалуйста, установите его.");
        return;
    }
    
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        let curentChainId = await window.ethereum.request ({method:'eth_chainId'});
        console.log(curentChainId);
        if (curentChainId != ancilId){
            try{
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId:ancilId}]
                });
            } catch (chainError){
            console.error("Не удалось добавить сеть:", chainError);
            alert("Не удалось добавить сеть. Пожалуйста, сделайте это вручную.");
            return;
            }
        }
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contractWithSigner = new ethers.Contract(contractAddress, contractABI, signer);
        const address = await signer.getAddress();
        console.log("MetaMask подключен -", address);
        if (connectMM) {
            connectMM.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        }
    } catch (error) {
        console.error("Не удалось подключиться к MetaMask:", error);
    }
}

disConnectMM.addEventListener('click', disConnectMetaMask);
async function disConnectMetaMask(){
try {
    const address = await signer.getAddress();
    await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
    })
    console.log("Disconnected web3 wallet -",  address );
    connectMM.textContent = "WALLET";
}catch(error) {console.debug('revokePermissions not available:', error)}};


connectMetaMask();

if (!inputPass || !inputValue || !buttonReg) {
    console.error("Hе удалось найти все необходимые HTML-элементы (блок создания аккаунта).");
} else {
    buttonReg.addEventListener('click', newDeposit);
}

buttonReg.addEventListener('click', newDeposit);
async function newDeposit(e) {
    e.preventDefault();
    try {
     const value = inputValue.value;
     const rawpass =  inputPass.value;
    const pass = await hashString(rawpass);
     const valueInETH = ethers.parseEther(value);
     console.log(`Setting pass to "${pass}"...`);
    const tx = await contractWithSigner.newUser("0x" + pass, valueInETH , {value: valueInETH});
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed.");
    const trans = await provider.getTransaction(tx.hash);
    console.log(trans);
    getTxDataFromHash(tx.hash);
    checkBalance();
    } catch  (error) {

    }
}

async function hashString(str) {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}


if (!depositPass || !depositValue || !buttonDep) {
    console.error("Не удалось найти все необходимые HTML-элементы (блок депозита).");
} else {
    buttonDep.addEventListener('click', deposit);
}

buttonDep.addEventListener('click', deposit);

async function deposit(e) {
    e.preventDefault();
    try {      
     const value = depositValue.value;
     const rawpass =  inputPass.value;
     const pass = await hashString(rawpass);
     const valueInETH = ethers.parseEther(value);
     console.log(`Depostiting from pass "${pass}"...`);
    const tx = await contractWithSigner.deposit("0x" + pass, valueInETH , {value: valueInETH});
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed.");
    const trans = await provider.getTransaction(tx.hash);
    console.log(trans);
    getTxDataFromHash(tx.hash);
    checkBalance();
    } catch  (error) {

    }
}

if (!withPass || !withAddress || !buttonWith) {
    console.error("Не удалось найти все необходимые HTML-элементы (блок вывода).");
} else {
    buttonWith.addEventListener('click', withdraw);
}


async function withdraw(e) {
    e.preventDefault();
    try {
          if (!contractWithSigner) {
    alert("Пожалуйста, сначала подключите кошелёк.");
    return;
  }
     const address = withAddress.value;
     const pass = withPass.value;
     console.log(`Withdrawing from pass "${pass}"...`);
    const tx = await contractWithSigner.withdraw(pass, address);
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed.");
    const trans = await provider.getTransaction(tx.hash);
    console.log(trans);
    getTxDataFromHash(tx.hash);
    checkBalance();
    } catch  (error) {

    }
}






