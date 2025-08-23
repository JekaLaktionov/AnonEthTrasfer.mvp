//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import  "@openzeppelin/contracts/access/Ownable.sol";

contract ethAnonTransfer is Ownable {
        constructor() Ownable(msg.sender) {
    }
    uint256 public constant feeRate = 70; // fee rate = 0.7%

    // hashed key => eth amount
    mapping(bytes32 => uint256) private balance;

    // onwer wallet => fee amount
    mapping(address => uint256) private feeTreasure;

    error UserIncorect();

    function newUser(bytes32 _hash, uint256 _amount) public payable returns(bool) {
        require(_hash != bytes32(0) && _amount != 0, "Zero hash or amoumt");
        require(_amount >= 0.01 ether, "Amount too low");
        require(_amount == msg.value, "Amount incorect");
        require(balance[_hash] == 0,"User already exists");
        balance[_hash] = _amount;
        return true;
    }

    function deposit(bytes32 _hash, uint256 _amount) public payable {
        require(_hash != bytes32(0) && _amount != 0, "Zero hash or amoumt");
        require(_amount >= 0.01 ether, "Amount too low");
        require(_amount == msg.value, "Amount incorect");
        require(balance[_hash] != 0 && balance[_hash] != 1, UserIncorect());
        balance[_hash] += _amount;
    }

    function withdraw(string memory _key, address _recipient) public {
        require(bytes(_key).length > 0, "Key is empty");
        bytes32 decodedHash = (sha256(abi.encodePacked(_key)));
        require(balance[decodedHash] != 0 , UserIncorect());
        require(balance[decodedHash] != 1, "User already exists");
        uint256 valueRaw = balance[decodedHash];
        uint256 fee = (valueRaw * feeRate) / 10000;
        uint256 value = valueRaw - fee;
        feeTreasure[owner()] += fee;
        balance[decodedHash] = 1;
        (bool success, ) = _recipient.call{value: value}("");
        require(success == true, "Cant send funds");
    }

    function withdrawFee() public onlyOwner {
      require(feeTreasure[owner()] != 0, "No funds");
      uint256 value = feeTreasure[owner()];
      feeTreasure[owner()] = 0;
      (bool success, ) = owner().call{value: value}("");
      require(success == true, "Cant send funds");
    }
    
}
