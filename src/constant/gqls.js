import gql from "graphql-tag";

export const GQL_GETMYLISTED = gql`
  query GetMyListedNft($address: String!) {
    nfts(
      where: { owner: $address, type: 0 }
      orderBy: id
      orderDirection: desc
    ) {
      id
      owner
      type
      originalPrice
      bids {
        id
        price
        address
      }
    }
  }
`;

export const GQL_GETLISTED = gql`
query GetListedNft {
  nfts {
    id
    lastListedBy
    type
    bids {
      id
      price
      address
      createdAt
    }
    owner
    tokenId
    contract
    originalPrice
    auctionDuration
  }
}
`;

export const GQL_GETALL = gql`
  query GetAllNft {
    nfts {
      id
      lastListedBy
      type
      bids {
        id
        price
        address
        createdAt
      }
      owner
      tokenId
      contract
      originalPrice
      auctionDuration
    }
  }
`;
