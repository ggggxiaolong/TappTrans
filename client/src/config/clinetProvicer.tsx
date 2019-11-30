import React, { useState, ReactNode } from "react";
import ApolloClient, { PresetConfig, gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const defaultConfig: PresetConfig = {
  uri: process.env.REACT_APP_HOST
};

type RefreshToken = {
  refresh?(): Promise<boolean>;
};

export const TokenContext = React.createContext<RefreshToken>({});

export default function ClinetProvider({ children }: { children?: ReactNode }) {
  const [config, setConfig] = useState(defaultConfig);
  const client = new ApolloClient(config);
  async function freshToken(): Promise<boolean> {
    return new ApolloClient(defaultConfig)
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
