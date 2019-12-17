import { Lang } from "./Lang";

export class AddLang {
    en?: string;
    ja?: string;
    ko?: string;
    sk?: string;
    cs?: string;
    fr?: string;
    es?: string;
    not_trans: number;
    descripe?: string;
    label?: string;
    file_name?: string;
    project_id: number;
    mode_name?: string;
    constructor(lang: Lang) {
        this.project_id = lang.project_id;
        this.not_trans = lang.not_trans;
        this.en = lang.en;
        this.ja = lang.ja;
        this.ko = lang.ko;
        this.sk = lang.sk;
        this.cs = lang.cs;
        this.fr = lang.fr;
        this.es = lang.es;
        this.label = lang.label;
        this.mode_name = lang.mode_name;
    }
}