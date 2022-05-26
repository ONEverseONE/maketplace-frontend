import gql from "graphql-tag";

export const GQL_GETMYLISTED = gql`
  query GetMyListedNft($address: String!) {
    nfts(where: {owner: $address}, first: 12, orderBy: id, orderDirection: desc) {
      id
      owner
      type
    }
  }
`;