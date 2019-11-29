import {gql} from 'apollo-server';

export const typeDefs = gql`
directive @auth on OBJECT | FIELD_DEFINITION
type User {
    id: ID!
    username: String
    mail: String
}

type Token {
    accessToken: String!
    refreshToken: String!
}

type Project {
    id: ID!
    name: String
}

type Lang {
    id: ID!
    user_id: Int
    en: String
    ja: String
    ko: String
    sk: String
    cs: String
    fr: String
    es: String
    not_trans: Int
    descripe: String
    label: String
    file_name: String
    mode_name: String
    project_id: Int
    status: Int!
    new_en: String
    new_ja: String
    new_ko: String
    new_sk: String
    new_cs: String
    new_fr: String
    new_es: String
    new_not_trans: Int
    new_descripe: String
    new_label: String
    new_file_name: String
    new_mode_name: String
    new_project_id: Int
    update_time: Float
    update_user_id: Float
}
type Trans {
    en: String
    ja: String
    ko: String
    sk: String
    cs: String
    fr: String
    es: String
}

input AddUser {
    username: String!
    mail: String!
    password: String!
}

input AddLang {
    en: String
    ja: String
    ko: String
    sk: String
    cs: String
    fr: String
    es: String
    not_trans: Int!
    descripe: String
    label: String
    file_name: String
    project_id: Int!
    mode_name: String
}

input UpdateLang {
    id: ID!
    en: String
    ja: String
    ko: String
    sk: String
    cs: String
    fr: String
    es: String
    not_trans: Int
    descripe: String
    label: String
    file_name: String
    project_id: Int
    mode_name: String
}

type Query {
    login(mail: String!, password: String!): Token!
    refreshToken(token: String): Token!
    language(page: Int, pageSize: Int, search: String, projectId: Int, type: String): [Lang!] @auth
    projects: [Project] @auth
    trans(en: String): Trans! @auth
}

type Mutation {
    register(user: AddUser): User @auth
    addLang(lang: AddLang): Lang @auth
    updateLang(lang: UpdateLang): Lang @auth
}
`;