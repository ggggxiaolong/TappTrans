import React, { ReactNode } from "react";
import ApolloClient, { PresetConfig, gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useCookies } from 'react-cookie';

type RefreshToken = {
  refresh?(): Promise<boolean>;
};

export const TokenContext = React.createContext<RefreshToken>({});

export default function ClinetProvider({ children }: { children?: ReactNode }) {
  const [cookie, setCookie] = useCookies(['token']);
  const defaultConfig: PresetConfig = {
    uri: process.env.REACT_APP_HOST,
    headers:{token:cookie.token},
  };
  // const [config, setConfig] = useState(defaultConfig);
  const client = new ApolloClient(defaultConfig);
  async function freshToken(): Promise<boolean> {
    return client
      .query({ query: gql`` })
      .catch(e => false)
      .then(r => true);
  }
  return (
    <ApolloProvider client={client}>
      <TokenContext.Provider value={{ refresh: freshToken }}>
        {children}
      </TokenContext.Provider>
    </ApolloProvider>
  );
}
