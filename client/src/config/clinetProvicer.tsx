import React, { ReactNode } from "react";
import ApolloClient, { PresetConfig, gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useCookies } from 'react-cookie';
import { RefreshToken } from "../entity/refreshToken";

type Refresh = {
  refresh(): Promise<boolean>;
};

const REFRESH_TOKEN = gql`
  query refresh($token: String) {
    refreshToken(token: $token) {
      accessToken refreshToken
    }
  }
`;

export const TokenContext = React.createContext<Refresh>({refresh:() => Promise.resolve(false)});

export default function ClinetProvider({ children }: { children?: ReactNode }) {
  const [cookie, setCookie] = useCookies(["token"]);
  const defaultConfig: PresetConfig = {
    uri: process.env.REACT_APP_HOST,
    headers:{token:cookie.token},
  };
  
  const client = new ApolloClient(defaultConfig);
  async function freshToken(): Promise<boolean> {
    return client
      .query<RefreshToken,{}>({ query: REFRESH_TOKEN, variables:{token:cookie.refreshToken} })
      .then(r => {
        // setCookie("token", new Cookie(r.data));
        const data = r.data.refreshToken
        setCookie("token", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        return true
      })
      .catch(e => false);
  }
  return (
    <ApolloProvider client={client}>
      <TokenContext.Provider value={{ refresh: freshToken }}>
        {children}
      </TokenContext.Provider>
    </ApolloProvider>
  );
}
