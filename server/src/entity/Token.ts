export class Token{
    accessToken: String
    refreshToken: String
    constructor(accessToken: String, refreshToken: String){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}