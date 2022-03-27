// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EpicGame is ERC721 {
    using Counters for Counters.Counter;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );

    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
        uint256 timesMinted;
    }

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    Counters.Counter private _tokenIds;
    mapping(address => uint256) nftHolders;
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    CharacterAttributes[] public defaultCharacters;
    BigBoss public bigBoss;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721("Heroes", "HERO") {
        for (uint256 i = 0; i < characterNames.length; i++) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i],
                    timesMinted: 0
                })
            );

            CharacterAttributes memory character = defaultCharacters[i];

            console.log(
                "Done initializing %s with HP %d, img %s",
                character.name,
                character.hp,
                character.imageURI
            );
        }

        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });

        console.log(
            "Done initializing boss %s w/ HP %d, img %s",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.imageURI
        );

        _tokenIds.increment();
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage,
            timesMinted: defaultCharacters[_characterIndex].timesMinted
        });

        defaultCharacters[_characterIndex].timesMinted += 1;

        console.log(
            "Minted NFT with tokenID %d and characterIndex %d",
            newItemId,
            _characterIndex
        );

        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory characterAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(characterAttributes.hp);
        string memory strMaxHp = Strings.toString(characterAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            characterAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name":"',
                characterAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '","description":"This is an NFT that lets people play in the game Metaverse Innvo Slayer!","image":"',
                characterAttributes.imageURI,
                '","attributes":[{"trait_type":"Health Points","value":"',
                strHp,
                '","max_value":"',
                strMaxHp,
                '"},{"trait_type":"Attack Damage","value": "',
                strAttackDamage,
                '"}]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public {
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        console.log(
            "\nPlayer w/ character %s about to attack. Has %d HP and %d AD",
            player.name,
            player.hp,
            player.attackDamage
        );
        console.log(
            "Boss %s has %d HP and %d AD",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );

        require(player.hp > 0, "Error: character must have HP to attack boss.");

        require(bigBoss.hp > 0, "Error: boss must have HP to attack boss.");

        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp -= player.attackDamage;
        }

        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp -= bigBoss.attackDamage;
        }

        console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
        console.log("Boss attacked player. New player hp: %s\n", player.hp);

        emit AttackComplete(bigBoss.hp, player.hp);
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        uint256 userNftTokenId = nftHolders[msg.sender];

        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }
}
