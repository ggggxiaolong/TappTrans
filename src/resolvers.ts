import { getRepository, createQueryBuilder, getConnection, EntityManager, MoreThan } from "typeorm";
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
        language: async(_,{search, pageSize = 20, page = 0 }:{search: string, pageSize: number, page: number}, __, ___) => {
            var queryBuilder = getRepository(Lang).createQueryBuilder("lang");
            if(search && 0 < search.length){
                queryBuilder = queryBuilder.where("lang.en LIKE %:search%", {search:search})
            }
            return await queryBuilder.limit(pageSize).offset(page).getMany()
        },
        projects: async(_,__,___, ____) => {
            return await getRepository(Project).find()
        }
    },
    Mutation: {
        addLang: async(_, {lang}:{lang: AddLang},{user}:{user: User}, __) => {
            const langRepo = getRepository(Lang);
            const newLang = new Lang();
            lang.update(newLang, user.id);
            langRepo.insert(newLang);
        },
        updateLang: async(_, {lang}:{lang: UpdateLang},{user}:{user: User}, __) => {
            const langRepo = getRepository(Lang);
            const newLang = new Lang();
            lang.update(newLang, user.id);
            langRepo.save(newLang);
        }
    }
};