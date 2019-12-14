import { Token } from "./token";

export class Cookie{
    token: string;
    refreshToken: string;
    constructor(t: Token){
        this.token = t.accessToken;
        this.refreshToken = t.refreshToken;
    }
}