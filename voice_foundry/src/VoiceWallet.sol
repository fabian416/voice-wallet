// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "voice_foundry/lib/openzeppelin-contracts/contracts/access/Ownable.sol"; // control de permisos
import {IERC20} from "voice_foundry/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol"; // interfaz ERC20
import {SafeERC20} from "voice_foundry/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol"; // transferencias seguras

interface IVerifier {
    function verify(bytes calldata proof, bytes calldata publicInputs) external view returns (bool);
}

contract VoiceWallet is Ownable {
    using SafeERC20 for IERC20;

    IVerifier public verifier;
    bytes32 public voiceCommitment;

    constructor(address _verifier, bytes32 _commitment) {
        verifier = IVerifier(_verifier);
        voiceCommitment = _commitment;
        _transferOwnership(msg.sender); // importante cuando usás Ownable
    }

    function registerVoice(bytes32 commitment) external onlyOwner {
        voiceCommitment = commitment;
    }

    function executeTokenTransfer(
        address token,
        address to,
        uint256 amount,
        bytes calldata proof,
        bytes calldata publicInputs
    ) external onlyOwner {
        require(verifier.verify(proof, publicInputs), "Invalid ZK proof");
        IERC20(token).safeTransfer(to, amount);
    }

    function emergencyWithdraw(address token, address to) external onlyOwner {
        IERC20(token).safeTransfer(to, IERC20(token).balanceOf(address(this)));
    }
}