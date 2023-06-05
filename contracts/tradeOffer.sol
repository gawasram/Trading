// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract tradeOffer {
    using Counters for Counters.Counter;

    address public token1 = 0x61D620473acd26cB76C2867860479C9a18e63020;
    address public token2 = 0xb41E3ce9A37643d7B4a67f62126468F1C6F70364;
    address public token3 = 0x17864B7bf61073DF9ED6c0ee90f8117687c2ADe6;
    address public token4 = 0xfE2f637036B869d7F296708BaAd3622c53f0D97D;
    address public token5 = 0x80fF8a9A77F78FC413015068a858F7A56848480A;

    struct Offer {
        uint256 offerId;
        address offerCreator;
        uint256 offerAmount1;
        uint256 offerAmount2;
        uint256 offerAmount3;
        uint256 offerAmount4;
        uint256 offerAmount5;
        uint256 wantedAmount1;
        uint256 wantedAmount2;
        uint256 wantedAmount3;
        uint256 wantedAmount4;
        uint256 wantedAmount5;
        uint256 offerTimestamp;
        bool offerStatus;
    }

    mapping (uint256 => Offer) offerMapping;
    Counters.Counter private offerCounter;

    function makeOffer(
        uint256 _offerAmount1,
        uint256 _offerAmount2,
        uint256 _offerAmount3,
        uint256 _offerAmount4,
        uint256 _offerAmount5,
        uint256 _wantedAmount1,
        uint256 _wantedAmount2,
        uint256 _wantedAmount3,
        uint256 _wantedAmount4,
        uint256 _wantedAmount5
    ) public payable {
        require(
            (_offerAmount1 > 0 ||
            _offerAmount2 > 0 ||
            _offerAmount3 > 0 ||
            _offerAmount4 > 0 ||
            _offerAmount5 > 0) &&
            (_wantedAmount1 > 0 ||
            _wantedAmount2 > 0 ||
            _wantedAmount3 > 0 ||
            _wantedAmount4 > 0 ||
            _wantedAmount5 > 0),
            "Invalid offer"
        );

        // Increment offer counter
        offerCounter.increment();

        // Create new offer
        Offer storage newOffer = offerMapping[offerCounter.current()];
        newOffer.offerId = offerCounter.current();
        newOffer.offerCreator = msg.sender;
        newOffer.offerAmount1 = _offerAmount1;
        newOffer.offerAmount2 = _offerAmount2;
        newOffer.offerAmount3 = _offerAmount3;
        newOffer.offerAmount4 = _offerAmount4;
        newOffer.offerAmount5 = _offerAmount5;
        newOffer.wantedAmount1 = _wantedAmount1;
        newOffer.wantedAmount2 = _wantedAmount2;  // Fix: Assign the value to the struct variable
        newOffer.wantedAmount3 = _wantedAmount3;
        newOffer.wantedAmount4 = _wantedAmount4;
        newOffer.wantedAmount5 = _wantedAmount5;
        newOffer.offerTimestamp = block.timestamp;
        newOffer.offerStatus = true;

        // Transfer tokens from the offer creator to the contract
        if (_offerAmount1 > 0) {
            require(IERC20(token1).transferFrom(msg.sender, address(this), _offerAmount1), "Token 1 transfer failed");
        }
        if (_offerAmount2 > 0) {
            require(IERC20(token2).transferFrom(msg.sender, address(this), _offerAmount2), "Token 2 transfer failed");
        }
        if (_offerAmount3 > 0) {
            require(IERC20(token3).transferFrom(msg.sender, address(this), _offerAmount3), "Token 3 transfer failed");
        }
        if (_offerAmount4 > 0) {
            require(IERC20(token4).transferFrom(msg.sender, address(this), _offerAmount4), "Token 4 transfer failed");
        }
        if (_offerAmount5 > 0) {
            require(IERC20(token5).transferFrom(msg.sender, address(this), _offerAmount5), "Token 5 transfer failed");
        }

        emit OfferMade(newOffer.offerId, msg.sender);
    }

    event OfferMade(uint256 offerId, address offerCreator);
}