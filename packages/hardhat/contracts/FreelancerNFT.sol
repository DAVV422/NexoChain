// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FreelancerNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Events
    event FreelancerMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string freelancerName,
        string initialURI
    );
    
    event ProfileUpdated(
        uint256 indexed tokenId,
        address indexed owner,
        string newURI,
        uint256 jobsCompleted,
        uint256 totalEarned
    );

    struct FreelancerStats {
        uint256 jobsCompleted;
        uint256 totalEarned; // Could be in ETH or USD (with decimals)
        string[] skills;     // Storing as array of strings
    }

    // Mapping from token ID to freelancer stats
    mapping(uint256 => FreelancerStats) private _freelancerStats;

    // Mapping from token ID to freelancer name (stored on-chain)
    mapping(uint256 => string) private _freelancerNames;

    constructor() ERC721("FreelancerProfile", "FRLNC") {}

    // Soulbound token - cannot be transferred
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override virtual {
        require(from == address(0), "Token is soulbound and cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // Mint a new freelancer NFT
    function mintFreelancerNFT(
        address freelancerAddress,
        string memory freelancerName,
        string memory initialURI,
        string[] memory initialSkills
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(freelancerAddress, tokenId);
        _setTokenURI(tokenId, initialURI);
        
        // Initialize freelancer stats
        _freelancerStats[tokenId] = FreelancerStats({
            jobsCompleted: 0,
            totalEarned: 0,
            skills: initialSkills
        });
        
        _freelancerNames[tokenId] = freelancerName;

        emit FreelancerMinted(tokenId, freelancerAddress, freelancerName, initialURI);
        return tokenId;
    }

    // Update freelancer profile (URI and stats)
    function updateProfile(
        uint256 tokenId,
        string memory newURI,
        uint256 earnedValue,
        string[] memory newSkills
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        // Update the token URI (off-chain metadata reference)
        _setTokenURI(tokenId, newURI);
        
        // Update on-chain stats
        FreelancerStats storage stats = _freelancerStats[tokenId];
        stats.jobsCompleted += 1;
        stats.totalEarned += earnedValue;
        
        // Update skills - in a real implementation you might want more complex logic
        stats.skills = newSkills;

        emit ProfileUpdated(
            tokenId,
            msg.sender,
            newURI,
            stats.jobsCompleted,
            stats.totalEarned
        );
    }

    // Get freelancer name
    function getFreelancerName(uint256 tokenId) public view returns (string memory) {
        return _freelancerNames[tokenId];
    }

    // Get freelancer stats
    function getFreelancerStats(uint256 tokenId) public view returns (
        uint256 jobsCompleted,
        uint256 totalEarned,
        string[] memory skills
    ) {
        FreelancerStats memory stats = _freelancerStats[tokenId];
        return (
            stats.jobsCompleted,
            stats.totalEarned,
            stats.skills
        );
    }

    // Get all token IDs owned by an address
    function getTokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
                if (currentIndex == balance) break;
            }
        }
        
        return tokenIds;
    }

    // The following functions are overrides required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
        super._burn(tokenId);
        // Clear on-chain data when burned
        delete _freelancerStats[tokenId];
        delete _freelancerNames[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}