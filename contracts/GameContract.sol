// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameContract {
    // Define the NFT tokens
    ERC721URIStorage public ropeNFT;
    ERC721URIStorage public netNFT;
    ERC721URIStorage public clothNFT;
    ERC721URIStorage public lumberNFT;
    ERC721URIStorage public forgeNFT;
    ERC721URIStorage public metalNFT;
    ERC721URIStorage public hammerNFT;
    ERC721URIStorage public axNFT;
    ERC721URIStorage public sawNFT;
    ERC721URIStorage public cabinNFT;
    ERC721URIStorage public barnNFT;
    ERC721URIStorage public shipNFT;
    ERC721URIStorage public characterNFT;
    
    // Define the ERC20 tokens
    IERC20 public woolToken;
    IERC20 public woodToken;
    IERC20 public clayToken;
    IERC20 public rockToken;
    IERC20 public fishToken;
    IERC20 public nailsToken;
    
    // Mapping to keep track of the token counts
    mapping(address => uint256) public ropeTokenCount;
    mapping(address => uint256) public netTokenCount;
    // Add similar mappings for other NFT types
    
    constructor(
        address _ropeNFT,
        address _netNFT,
        address _clothNFT,
        address _lumberNFT,
        address _forgeNFT,
        address _metalNFT,
        address _hammerNFT,
        address _axNFT,
        address _sawNFT,
        address _cabinNFT,
        address _barnNFT,
        address _shipNFT,
        address _characterNFT,
        address _woolToken,
        address _woodToken,
        address _clayToken,
        address _rockToken,
        address _fishToken,
        address _nailsToken
    ) {
        ropeNFT = ERC721URIStorage(_ropeNFT);
        netNFT = ERC721URIStorage(_netNFT);
        clothNFT = ERC721URIStorage(_clothNFT);
        lumberNFT = ERC721URIStorage(_lumberNFT);
        forgeNFT = ERC721URIStorage(_forgeNFT);
        metalNFT = ERC721URIStorage(_metalNFT);
        hammerNFT = ERC721URIStorage(_hammerNFT);
        axNFT = ERC721URIStorage(_axNFT);
        sawNFT = ERC721URIStorage(_sawNFT);
        cabinNFT = ERC721URIStorage(_cabinNFT);
        barnNFT = ERC721URIStorage(_barnNFT);
        shipNFT = ERC721URIStorage(_shipNFT);
        characterNFT = ERC721URIStorage(_characterNFT);
        
        woolToken = IERC20(_woolToken);
        woodToken = IERC20(_woodToken);
        clayToken = IERC20(_clayToken);
        rockToken = IERC20(_rockToken);
        fishToken = IERC20(_fishToken);
        nailsToken = IERC20(_nailsToken);
    }
    
    function mintRopeNFT(uint256 woolAmount) external {
        // Burn wool tokens
        woolToken.transferFrom(msg.sender, address(0), woolAmount);
        
        // Check if the character NFT is held by the caller
        require(characterNFT.balanceOf(msg.sender) > 0, "Caller does not hold the required Character NFT");
        
        // Increment token count
        ropeTokenCount[msg.sender]++;
        
        // Mint the Rope NFT
        uint256 tokenId = ropeTokenCount[msg.sender];
        ropeNFT.mint(msg.sender, tokenId);
    }
    
    function mintNetNFT(uint256 ropeAmount) external {
        // Burn Rope NFT tokens
        require(ropeTokenCount[msg.sender] >= ropeAmount, "Insufficient Rope NFT balance");
        ropeTokenCount[msg.sender] -= ropeAmount;
        
        // Check if the character NFT is held by the caller
        require(characterNFT.balanceOf(msg.sender) > 0, "Caller does not hold the required Character NFT");
        
        // Increment token count
        netTokenCount[msg.sender]++;
        
        // Mint the Net NFT
        uint256 tokenId = netTokenCount[msg.sender];
        netNFT.mint(msg.sender, tokenId);
    }
    
    // Implement other mint functions using similar logic
    
    // Mint New Character NFT
    function mintNewCharacterNFT(address maleCharacter, address femaleCharacter, uint256 fishAmount) external {
        // Burn fish tokens
        fishToken.transferFrom(msg.sender, address(0), fishAmount);
        
        // Check if the male and female character NFTs are held by the caller
        require(characterNFT.balanceOf(msg.sender) > 0, "Caller does not hold the required male Character NFT");
        require(characterNFT.balanceOf(maleCharacter) > 0, "Caller does not hold the required female Character NFT");
        
        // Mint the new Character NFT
        uint256 tokenId = characterNFT.totalSupply() + 1;
        characterNFT.mint(msg.sender, tokenId);
    }
}