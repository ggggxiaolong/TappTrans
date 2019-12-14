import { Token } from "./token";

export class RefreshToken{
    refreshToken: Token;
    constructor(token: Token){
        this.refreshToken = token;
    }
}