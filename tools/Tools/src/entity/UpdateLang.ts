import { Trans } from "./trans";

export class UpdateLang {
    id: number;
    en: string;
    ja: string;
    ko: string;
    sk: string;
    cs: string;
    fr: string;
    es: string;
    not_trans: number;
    descripe: string;
    label: string;
    file_name: string;
    project_id: number;
    mode_name:string;
    new_user_id: number;
    update_time: number;
    constructor(id: number, trans: Trans){
        this.id = id;
        this.en = trans.en;
        this.ja = trans.ja;
        this.ko = trans.ko;
        this.sk = trans.sk;
        this.cs = trans.cs;
        this.fr = trans.fr;
        this.es = trans.es;
        this.update_time = new Date().getTime()
    }
}