// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IVerifier {
    function verify(bytes calldata proof, bytes calldata publicInputs) external view returns (bool);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract VoiceWallet {
    address public owner;
    bytes32 public voiceCommitment;
    IVerifier public verifier;

    constructor(address _verifier, bytes32 _commitment) {
        owner = msg.sender;
        verifier = IVerifier(_verifier);
        voiceCommitment = _commitment;
    }

    function registerVoice(bytes32 commitment) external {
        require(msg.sender == owner, "Only owner");
        voiceCommitment = commitment;
    }

    function executeTokenTransfer(
        address token,
        address to,
        uint256 amount,
        bytes calldata proof,
        bytes calldata publicInputs
    ) external {
        require(verifier.verify(proof, publicInputs), "Invalid ZK proof");
        require(IERC20(token).transfer(to, amount), "Transfer failed");
    }

    function emergencyWithdraw(address token, address to) external {
        require(msg.sender == owner, "Only owner");
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(to, balance);
    }
}