import { Lang } from "./Lang";
import { Utils } from "../Utils";

export class AddLang {
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
    mode_name: string
    update(lang: Lang, user_id: number) {
        lang.en = Utils.checkStringNull(this.en);
        lang.ja = Utils.checkStringNull(this.ja);
        lang.ko = Utils.checkStringNull(this.ko);
        lang.sk = Utils.checkStringNull(this.sk);
        lang.cs = Utils.checkStringNull(this.cs);
        lang.fr = Utils.checkStringNull(this.fr);
        lang.es = Utils.checkStringNull(this.es);
        lang.not_trans = this.not_trans;
        lang.descripe = Utils.checkStringNull(this.descripe);
        lang.label = Utils.checkStringNull(this.label);
        lang.file_name = Utils.checkStringNull(this.file_name);
        lang.project_id = this.project_id;
        lang.user_id = user_id;
        lang.mode_name = this.mode_name;
        lang.create_time = new Date().getTime();
    }
}