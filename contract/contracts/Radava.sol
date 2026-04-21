// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Radava {
    struct Receipt {
        string id;
        string product_name;
        uint quantity;
        uint price;
        uint256 timestamp;
        bool retired;
        uint256 closed_at; 
    }

    mapping(uint256 => Receipt[]) private receipts;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this method");
        _;
    }

    function addReceipt(
        uint256 _id,
        string memory id,
        string memory product_name ,
        uint quantity,
        uint price
        ) public onlyOwner {
        receipts[_id].push(Receipt(
                    id,
                    product_name,
                    quantity,
                    price,
                    block.timestamp,
                    false,
                    block.timestamp
            ));
    }

    function getReceipt(uint256 _id) public view returns (Receipt[] memory) {
        require(receipts[_id].length > 0, "Invalid user ID");
        
        return receipts[_id];
    }

    function closeReceipt(
        uint256 _id, uint256 index
        ) public onlyOwner {
        require(receipts[_id].length > 0, "Invalid user ID");
        require(bytes(receipts[_id][index].id).length > 0, "Receipt does not exist for the given index");
        receipts[_id][index].retired = true;
        receipts[_id][index].closed_at = block.timestamp;
    }
}
