import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcryptjs'
import { User } from "./entity/User";
import { Lang } from "./entity/Lang";
import { Token } from "./entity/Token";
import { AuthenticationError } from "apollo-server";
import { JWTData } from "./entity/JWTData";
import { Project } from "./entity/Project";
import { AddLang } from "./entity/Addlang";
import { UpdateLang } from "./entity/UpdateLang";
import { Trans } from "./entity/Trans";
import { google } from "translation.js";

export const resolvers = {
    Query: {
        login: async (_, { mail, password }, __, ___) => {
            const userRepository = getRepository(User)
            const user: User = await userRepository.findOne({ where: { mail: mail } })
            if (user && bcrypt.compareSync(password, user.password)) {
                user.password = ''
                const refreshToken = jwt.sign({user: user, isRefresh: true}, 'secret',{ expiresIn: 60 * 60 * 24 * 7})
                const accessToken = jwt.sign({user: user, isRefresh: false}, 'secret',{ expiresIn: 60 * 60})
                const token = new Token(accessToken, refreshToken)
                return token
            } else {
                throw new AuthenticationError("error username or password")
            }
        },
        refreshToken: async(_,{token}, __, ___) => {
            try{
                const data = <JWTData>jwt.verify(token, "secret",{ignoreExpiration: true})
                if(data.isRefresh){
                    const refreshToken = jwt.sign({user: data.user, isRefresh: true}, 'secret',{ expiresIn: 60 * 60 * 24 * 7})
                    const accessToken = jwt.sign({user: data.user, isRefresh: false}, 'secret',{ expiresIn: 60 * 60})
                    return new Token(accessToken, refreshToken)
                } else {
                    throw new AuthenticationError("error refres token")
                }
            } catch(e){
                return new AuthenticationError("refres token fail")
            }
        },
        language: async(_,{search, pageSize = 20, page = 0, projectId = 1 }:{search: string, pageSize: number, page: number, projectId: number}, __, ___) => {
            var queryBuilder = getRepository(Lang).createQueryBuilder("lang");
            if(search && 0 < search.length){
                queryBuilder = queryBuilder.where("lang.project_id = :projectId", {projectId:projectId, search:search}).andWhere("lang.en LIKE :search",{search:`%${search}%`})
            } else {
                queryBuilder = queryBuilder.where("lang.project_id = :projectId", {projectId:projectId})
            }
            return await queryBuilder.limit(pageSize).offset(page * pageSize).getMany()
        },
        projects: async(_,__,___, ____) => {
            return await getRepository(Project).find()
        },
        trans: async(_,{en}:{en:string},___,____) => {
            let t = new Trans()
            t.en = en
            return t
        }
    },
    Mutation: {
        addLang: async(_, {lang}:{lang: AddLang},{user}:{user: User}, __) => {
            const langRepo = getRepository(Lang);
            const newLang = new Lang();
            newLang.copyFromInsert(lang, user.id);
            let l = await langRepo.insert(newLang);
            return await langRepo.findOne({where:{id: l.raw}});;
        },
        updateLang: async(_, {lang}:{lang: UpdateLang},{user}:{user: User}, __) => {
            const langRepo = getRepository(Lang);
            const newLang = await langRepo.findOne({where:{id: lang.id}});
            if (!newLang) {return;}
            newLang.copyFromUpdate(lang, user.id);
            langRepo.update(lang.id, newLang);
            return await langRepo.findOne({where:{id: lang.id}});
        },
    },
    Trans:{
        ja: async(trans: Trans,_,__,___) => {
            if(trans.en){
                let r = await google.translate({text:trans.en, from:"en", to:'ja'})
                return r.result[0]
            } else {
                return ""
            }
        },
        ko: async(trans: Trans,_,__,___) => {
            if(trans.en){
                let r = await google.translate({text:trans.en, from:"en", to:'ko'})
                return r.result[0]
            } else {
                return ""
            }
        },
        sk: async(trans: Trans,_,__,___) => {
            if(trans.en){
                let r = await google.translate({text:trans.en, from:"en", to:'sk'})
                return r.result[0]
            } else {
                return ""
            }
        },
        cs: async(trans: Trans,_,__,___) => {
            if(trans.en){
                let r = await google.translate({text:trans.en, from:"en", to:'cs'})
                return r.result[0]
            } else {
                return ""
            }
        },
        fr: async(trans: Trans,_,__,___) => {
            if(trans.en){
                let r = await google.translate({text:trans.en, from:"en", to:'fr'})
                return r.result[0]
            } else {
                return ""
            }
        },
        es: async(trans: Trans,_,__,___) => {
            if(trans.en){
                let r = await google.translate({text:trans.en, from:"en", to:'es'})
                return r.result[0]
            } else {
                return ""
            }
        },
    }
};