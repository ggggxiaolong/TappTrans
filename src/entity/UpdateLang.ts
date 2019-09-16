import { Lang } from "./Lang";

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
    update(lang: Lang, user_id: number) {
        lang.id = this.id;
        lang.new_en = this.en;
        lang.new_ja = this.ja;
        lang.new_ko = this.ko;
        lang.new_sk = this.sk;
        lang.new_cs = this.cs;
        lang.new_fr = this.fr;
        lang.new_not_trans = this.not_trans;
        lang.new_descripe = this.descripe;
        lang.new_label = this.label;
        lang.new_file_name = this.file_name;
        lang.new_project_id = this.project_id;
        lang.new_user_id = user_id;
        lang.update_time = new Date().getTime();
    }
}