import { AddressZero, IpMetadata, PIL_TYPE, RegisterIpAndAttachPilTermsResponse, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, RPCProviderUrl, account } from './utils/utils'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Simple Mint and Register" example.

const main = async function () {
    // 1. Set up your Story Config
    //
    // Docs: https://docs.story.foundation/docs/typescript-sdk-setup
    const config: StoryConfig = {
        account: account,
        transport: http(RPCProviderUrl),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)

    // 2. Set up your IP Metadata
    //
    // Docs: https://docs.story.foundation/docs/ipa-metadata-standard
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
        title: 'Testinggg',
        description: 'This is a test IP asset',
        attributes: [
            {
                key: 'Rarity',
                value: 'Legendary',
            },
        ],
    })

    // 3. Set up your NFT Metadata
    //
    // Docs: https://eips.ethereum.org/EIPS/eip-721
    const nftMetadata = {
        "description": "Aqua Bag",
        "image": "https://rose-occupational-bee-58.mypinata.cloud/ipfs/QmQjSy4rfqiRZsMwNKNn7s1HobzmBYTWazz4jjnAuP2Tqu",
        "name": "BrightYellowHat",
        "attributes": [
          {
            "trait_type": "Strength",
            "value": 9
          },
          {
            "trait_type": "Intelligence",
            "value": 9
          },
          {
            "trait_type": "Charisma",
            "value": 9
          },
          {
            "trait_type": "Luck",
            "value": 7
          },
          {
            "trait_type": "Defense",
            "value": 1
          }
        ]
      }

    // 4. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = 'QmPzMW7Ggrg1zp88Ny7YZzqsQJa37ojWEd54vp2rchgsVh'
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')
    console.log("nftHash: ", nftHash);

    // 5. Mint an NFT
    // const tokenId = await mintNFT(account.address, `https://ipfs.io/ipfs/${nftIpfsHash}`)
    const tokenId = 1;
    console.log(`NFT minted with NFTContractAddress ${NFTContractAddress}`)

    // 6. Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/attach-terms-to-an-ip-asset#register-new-ip-asset-and-attach-license-terms
    const response: RegisterIpAndAttachPilTermsResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: "1",
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://rose-occupational-bee-58.mypinata.cloud/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
    console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`)
}

main()
