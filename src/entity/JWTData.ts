import { User } from "./User";

export class JWTData{
    user: User
    isRefresh: Boolean
    constructor(user: User, isRefresh: Boolean){
        user.password = ""
        this.user = user
        this.isRefresh = isRefresh
    }
}