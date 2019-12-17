import { Lang } from "../entity/Lang";
import { ApolloError, gql } from "apollo-boost";

export interface SearchParam {
    projectId: number;
    languages: Array<Language>;
    search: string;
    page: number;
    pageSize: number;
}

export interface Result {
    param: SearchParam;
    data: Array<Lang>;
    hasMore: boolean;
    error: ApolloError | null;
}

export type Language = "en" | "ja" | "ko" | "sk" | "cs" | "fr" | "es" ;
export type UpdateLang = "new_en" | "new_ja" | "new_ko" | "new_sk" | "new_cs" | "new_fr" | "new_es";
export const allLanguage: Array<Language> = ["en", "ja", "ko", "sk", "cs", "fr", "es"];

export const firstPageNum = 0;

export const defaultSearchParam: SearchParam = {
    projectId: 2,
    languages: allLanguage.slice(),
    search: "",
    page: firstPageNum,
    pageSize: 20
};

export const defaultResult: Result = {
    param: defaultSearchParam,
    data: [],
    hasMore: false,
    error: null,
};

export const languagesMap: Map<string, string> = new Map([
    ["status", "Status"],
    ["en", "English"],
    ["ja", "Japanese"],
    ["ko", "Korean"],
    ["sk", "Slovak"],
    ["cs", "Czech"],
    ["fr", "French"],
    ["es", "Spanish"]
]);

export const updateLangMap: Map<Language, UpdateLang> = new Map([
    ["en", "new_en"],
    ["ja", "new_ja"],
    ["ko", "new_ko"],
    ["sk", "new_sk"],
    ["cs", "new_cs"],
    ["fr", "new_fr"],
    ["es", "new_es"]
]);

export const LANGQUERY = (param: SearchParam) => gql`
    query language($page: Int, $search: String , $projectId: Int, $pageSize: Int) {
      language(page: $page, search: $search, projectId: $projectId, pageSize: $pageSize) {
        id ${param.languages.join(" ")} ${param.languages.map(l => updateLangMap.get(l)).join(" ")} status label
      }
    }
  `;

export const QUERY_TRANS = gql`
    query trans($en: String){
        trans(en: $en){
            en ja ko sk cs fr es
        }
    }
`;

export default {};