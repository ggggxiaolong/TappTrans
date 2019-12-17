import "reflect-metadata";
import { createConnection, EntityManager } from "typeorm";
import AllLang from './en'
import { Lang } from "./entity/Lang";
import { gql } from 'apollo-boost';
import { createHttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from 'node-fetch';
import { Trans } from "./entity/trans";
import { UpdateLang } from "./entity/UpdateLang";
import { TransReturn } from "./entity/TransReturn";
import { AddLang } from "./entity/addLang";

const QUERY_TRANS = gql`
  query trans($en: String){
      trans(en: $en){
          en ja ko sk cs fr es
      }
  }
`;

const QUERY_PROJECT = gql`
query project {
  projects{
    id
    name
  }
}`;

const MUTA_ADD_LANG = gql`
mutation addLang($lang: AddLang){
    addLang(lang: $lang){en}
}
`;

class Language {
    key: string;
    value: string;
    model: string;

    constructor(key: string, value: string, model: string) {
        this.key = key;
        this.value = value;
        this.model = model;
    }
};

const langMap = new Map<string, Language>();

function trans(): Array<Lang> {
    Object.entries(AllLang).map(([model, entity]) => {
        Object.entries(entity).map(([key, value]) => {
            save2Map(model, key, value)
        })
    })
    const array = new Array<Lang>();
    langMap.forEach((value: Language, key: string) => {
        const lang = new Lang();
        const time = new Date().getTime()
        lang.user_id = 1;
        lang.en = value.value;
        lang.label = value.key;
        lang.mode_name = value.model;
        lang.project_id = 4;
        lang.create_time = time;
        lang.update_time = time;
        array.push(lang);
    })
    return array;
}

function save2Map(model: string, key: string, value: string) {
    langMap.set(key, new Language(key, value, model))
}

function transLang(langs: Array<Lang>, manager: EntityManager) {
    const client = new ApolloClient({
        link: createHttpLink({
            uri: "",
            headers: { token: "" },
            fetch: fetch
        }),
        cache: new InMemoryCache(),
    });

    langs.map(la => {
        client.query<TransReturn>({ query: QUERY_TRANS, variables: { en: la.en } })
            .then(r => {
                const trans = r.data.trans
                const updateLang = new UpdateLang(la.id, trans)
                manager.getRepository(Lang).update(la.id, updateLang)
                console.log()
                console.log(updateLang)
            })
            .catch(e => console.log(e))
    })
}

function addLang(langs: Array<Lang>, manager: EntityManager) {
    const client = new ApolloClient({
        link: createHttpLink({
            uri: "",
            headers: { token: "" },
            fetch: fetch
        }),
        cache: new InMemoryCache(),
    });

    langs.map(la => {
        const addLang = new AddLang(la);
        client.mutate({ mutation: MUTA_ADD_LANG, variables: { lang: addLang } })
            .then(r => {
                console.log(r.data)
            })
            .catch(e => console.warn(e))
    })
}

createConnection().then(async connection => {
    const langs = await connection.manager.find(Lang);
    // console.log(langs[0])
    addLang(langs, connection.manager)
    // transLang(langs, connection.manager);
    // const langs = trans();
    // connection.manager.save(langs);
}).catch(error => console.log(error));
