// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RopeNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Rope NFT", "ROPE") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract NetNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Net NFT", "NET") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract ClothNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Cloth NFT", "CLOTH") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract LumberNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Lumber NFT", "LUMBER") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract ForgeNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Forge NFT", "FORGE") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract MetalNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Metal NFT", "METAL") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract HammerNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Hammer NFT", "HAMMER") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract AxNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Ax NFT", "AX") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract SawNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Saw NFT", "SAW") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract CabinNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Cabin NFT", "CABIN") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract BarnNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Barn NFT", "BARN") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract ShipNFT is ERC721, ERC721Burnable {
    constructor() ERC721("Ship NFT", "SHIP") {}

    function mint(address to) public {
        _mint(to, totalSupply() + 1);
    }
}

contract CharacterNFT is ERC721, ERC721Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("Character NFT", "CHARACTER") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to) public onlyRole(MINTER_ROLE) {
        _mint(to, totalSupply() + 1);
    }
}

contract WoodInTheBlockchainLand is AccessControl {
    RopeNFT public ropeNFT;
    NetNFT public netNFT;
    ClothNFT public clothNFT;
    LumberNFT public lumberNFT;
    ForgeNFT public forgeNFT;
    MetalNFT public metalNFT;
    HammerNFT public hammerNFT;
    AxNFT public axNFT;
    SawNFT public sawNFT;
    CabinNFT public cabinNFT;
    BarnNFT public barnNFT;
    ShipNFT public shipNFT;
    CharacterNFT public characterNFT;

    uint256 public constant FISH_BURN_AMOUNT = 1;
    uint256 public constant LUMBER_NAILS_BURN_AMOUNT = 1;
    uint256 public constant ROPE_CLOTH_BURN_AMOUNT = 1;
    uint256 public constant WOOD_METAL_BURN_AMOUNT = 1;
    uint256 public constant WOOD_METAL_CABIN_BURN_AMOUNT = 1;
    uint256 public constant WOOD_METAL_BARN_BURN_AMOUNT = 1;
    uint256 public constant LUMBER_NAILS_CLOTH_ROPE_BURN_AMOUNT = 1;
    uint256 public constant WOOD_METAL_CABIN_SHIP_BURN_AMOUNT = 1;

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
        address _characterNFT
    ) {
        ropeNFT = RopeNFT(_ropeNFT);
        netNFT = NetNFT(_netNFT);
        clothNFT = ClothNFT(_clothNFT);
        lumberNFT = LumberNFT(_lumberNFT);
        forgeNFT = ForgeNFT(_forgeNFT);
        metalNFT = MetalNFT(_metalNFT);
        hammerNFT = HammerNFT(_hammerNFT);
        axNFT = AxNFT(_axNFT);
        sawNFT = SawNFT(_sawNFT);
        cabinNFT = CabinNFT(_cabinNFT);
        barnNFT = BarnNFT(_barnNFT);
        shipNFT = ShipNFT(_shipNFT);
        characterNFT = CharacterNFT(_characterNFT);
    }

    function mintRopeNFT(uint256 burnAmount) public {
        require(burnAmount > 0, "Invalid burn amount");
        require(ropeNFT.balanceOf(msg.sender) >= burnAmount, "Insufficient Rope NFTs");
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        ropeNFT.burnFrom(msg.sender, burnAmount);
        characterNFT.mint(msg.sender);
    }

    function mintNetNFT(uint256 burnAmount) public {
        require(burnAmount > 0, "Invalid burn amount");
        require(netNFT.balanceOf(msg.sender) >= burnAmount, "Insufficient Net NFTs");
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        netNFT.burnFrom(msg.sender, burnAmount);
        characterNFT.mint(msg.sender);
    }

    function mintClothNFT(uint256 burnAmount) public {
        require(burnAmount > 0, "Invalid burn amount");
        require(clothNFT.balanceOf(msg.sender) >= burnAmount, "Insufficient Cloth NFTs");
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        clothNFT.burnFrom(msg.sender, burnAmount);
        characterNFT.mint(msg.sender);
    }

    function mintLumberNFT(uint256 burnAmount) public {
        require(burnAmount > 0, "Invalid burn amount");
        require(lumberNFT.balanceOf(msg.sender) >= burnAmount, "Insufficient Lumber NFTs");
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        lumberNFT.burnFrom(msg.sender, burnAmount);
        characterNFT.mint(msg.sender);
    }

    function mintForgeNFT(uint256 burnAmount) public {
        require(burnAmount > 0, "Invalid burn amount");
        require(forgeNFT.balanceOf(msg.sender) >= burnAmount, "Insufficient Forge NFTs");
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        forgeNFT.burnFrom(msg.sender, burnAmount);
        characterNFT.mint(msg.sender);
    }

    function mintMetalNFT(uint256 burnWoodAmount, uint256 burnRockAmount) public {
        require(burnWoodAmount > 0 && burnRockAmount > 0, "Invalid burn amounts");
        require(
            metalNFT.balanceOf(msg.sender) >= (burnWoodAmount + burnRockAmount),
            "Insufficient Metal NFTs"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        metalNFT.burnFrom(msg.sender, (burnWoodAmount + burnRockAmount));
        characterNFT.mint(msg.sender);
    }

    function mintHammerNFT(uint256 burnWoodAmount, uint256 burnMetalAmount) public {
        require(burnWoodAmount > 0 && burnMetalAmount > 0, "Invalid burn amounts");
        require(
            hammerNFT.balanceOf(msg.sender) >= (burnWoodAmount + burnMetalAmount),
            "Insufficient Hammer NFTs"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        hammerNFT.burnFrom(msg.sender, (burnWoodAmount + burnMetalAmount));
        characterNFT.mint(msg.sender);
    }

    function mintAxNFT(uint256 burnWoodAmount, uint256 burnMetalAmount) public {
        require(burnWoodAmount > 0 && burnMetalAmount > 0, "Invalid burn amounts");
        require(
            axNFT.balanceOf(msg.sender) >= (burnWoodAmount + burnMetalAmount),
            "Insufficient Ax NFTs"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        axNFT.burnFrom(msg.sender, (burnWoodAmount + burnMetalAmount));
        characterNFT.mint(msg.sender);
    }

    function mintSawNFT(uint256 burnWoodAmount, uint256 burnMetalAmount) public {
        require(burnWoodAmount > 0 && burnMetalAmount > 0, "Invalid burn amounts");
        require(
            sawNFT.balanceOf(msg.sender) >= (burnWoodAmount + burnMetalAmount),
            "Insufficient Saw NFTs"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        sawNFT.burnFrom(msg.sender, (burnWoodAmount + burnMetalAmount));
        characterNFT.mint(msg.sender);
    }

    function mintCabinNFT(uint256 burnLumberAmount, uint256 burnNailsAmount) public {
        require(burnLumberAmount > 0 && burnNailsAmount > 0, "Invalid burn amounts");
        require(
            cabinNFT.balanceOf(msg.sender) >= (burnLumberAmount + burnNailsAmount),
            "Insufficient Cabin NFTs"
        );
        require(
            hammerNFT.ownerOf(msg.sender) != address(0) && sawNFT.ownerOf(msg.sender) != address(0),
            "Hammer and Saw NFTs required"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        cabinNFT.burnFrom(msg.sender, (burnLumberAmount + burnNailsAmount));
        characterNFT.mint(msg.sender);
    }

    function mintBarnNFT(uint256 burnLumberAmount, uint256 burnNailsAmount) public {
        require(burnLumberAmount > 0 && burnNailsAmount > 0, "Invalid burn amounts");
        require(
            barnNFT.balanceOf(msg.sender) >= (burnLumberAmount + burnNailsAmount),
            "Insufficient Barn NFTs"
        );
        require(
            hammerNFT.ownerOf(msg.sender) != address(0) && sawNFT.ownerOf(msg.sender) != address(0),
            "Hammer and Saw NFTs required"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        barnNFT.burnFrom(msg.sender, (burnLumberAmount + burnNailsAmount));
        characterNFT.mint(msg.sender);
    }

    function mintShipNFT(
        uint256 burnLumberAmount,
        uint256 burnNailsAmount,
        uint256 burnClothAmount,
        uint256 burnRopeAmount
    ) public {
        require(
            burnLumberAmount > 0 && burnNailsAmount > 0 && burnClothAmount > 0 && burnRopeAmount > 0,
            "Invalid burn amounts"
        );
        require(
            shipNFT.balanceOf(msg.sender) >=
                (burnLumberAmount + burnNailsAmount + burnClothAmount + burnRopeAmount),
            "Insufficient Ship NFTs"
        );
        require(
            hammerNFT.ownerOf(msg.sender) != address(0) && sawNFT.ownerOf(msg.sender) != address(0),
            "Hammer and Saw NFTs required"
        );
        require(characterNFT.ownerOf(msg.sender) != address(0), "Character NFT required");
        shipNFT.burnFrom(
            msg.sender,
            (burnLumberAmount + burnNailsAmount + burnClothAmount + burnRopeAmount)
        );
        characterNFT.mint(msg.sender);
    }

    function mintNewCharacterNFT() public {
        require(
            characterNFT.balanceOf(msg.sender) >= 2 && fishToken.balanceOf(msg.sender) >= FISH_BURN_AMOUNT,
            "Insufficient Character NFTs or FISH tokens"
        );
        characterNFT.burnFrom(msg.sender, 2);
        fishToken.burnFrom(msg.sender, FISH_BURN_AMOUNT);
        characterNFT.mint(msg.sender);
    }
}