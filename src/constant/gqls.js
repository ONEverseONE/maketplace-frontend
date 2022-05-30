import gql from "graphql-tag";

export const GQL_GETMYLISTED = gql`
  query GetMyListedNft($address: String!) {
    nfts(where: {owner: $address}, orderBy: id, orderDirection: desc) {
      id,
      owner,
      type,
      originalPrice,
      bids {
        id,
        price,
        address
      }
    }
  }
`;

export const GQL_GETLISTED = gql`
  query GetListedNft {
    nfts(orderBy: id, orderDirection: desc) {
      id,
      owner,
      type,
      originalPrice,
      bids {
        id,
        price,
        address
      }
    }
  }
`;