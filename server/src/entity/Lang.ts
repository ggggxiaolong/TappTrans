import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UpdateLang } from "./UpdateLang";
import { Utils } from "../Utils";
import { AddLang } from "./Addlang";

@Entity()
export class Lang {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ type: "text", nullable: true })
    en: string;

    @Column({ type: "text", nullable: true })
    ja: string;

    @Column({ type: "text", nullable: true })
    ko: string;

    @Column({ type: "text", nullable: true })
    sk: string;

    @Column({ type: "text", nullable: true })
    cs: string;

    @Column({ type: "text", nullable: true })
    fr: string;

    @Column({ type: "text", nullable: true })
    es: string;

    // 0 是否不需要翻译 0：否，1：是
    @Column({ default: 0 })
    not_trans: number;

    @Column({ type: "text", nullable: true })
    descripe: string;

    @Column({ type: "text", nullable: true })
    label: string;

    @Column({ type: "text", nullable: true })
    file_name: string;

    @Column({ type: "text", nullable: true })
    mode_name: string;

    @Column()
    project_id: number;

    @Column({ nullable: true })
    new_user_id: number;

    @Column({ type: "text", nullable: true })
    new_en: string;

    @Column({ type: "text", nullable: true })
    new_ja: string;

    @Column({ type: "text", nullable: true })
    new_ko: string;

    @Column({ type: "text", nullable: true })
    new_sk: string;

    @Column({ type: "text", nullable: true })
    new_cs: string;

    @Column({ type: "text", nullable: true })
    new_fr: string;

    @Column({ type: "text", nullable: true })
    new_es: string;

    @Column({ nullable: true })
    new_not_trans: number;

    @Column({ type: "text", nullable: true })
    new_descripe: string;

    @Column({ type: "text", nullable: true })
    new_label: string;

    @Column({ type: "text", nullable: true })
    new_file_name: string;

    @Column({ type: "text", nullable: true })
    new_mode_name: string;

    @Column({ nullable: true })
    new_project_id: number;

    // 0为最新，1为更新，2为新增
    @Column({ default: 0 })
    status: number;

    @Column()
    create_time: number

    @Column({ nullable: true })
    update_time: number;

    copyFromUpdate(updateLong: UpdateLang, user_id: number) {
        this.id = updateLong.id;
        this.new_en = updateLong.en || null;
        this.new_ja = updateLong.ja || null;
        this.new_ko = updateLong.ko || null;
        this.new_sk = updateLong.sk || null;
        this.new_cs = updateLong.cs || null;
        this.new_es = updateLong.es || null;
        this.new_fr = updateLong.fr || null;
        this.new_not_trans = updateLong.not_trans || null;
        this.new_descripe = updateLong.descripe || null;
        this.new_label = updateLong.label || null;
        this.new_file_name = updateLong.file_name || null;
        this.new_project_id = updateLong.project_id || null;
        this.new_user_id = user_id;
        this.new_mode_name = updateLong.mode_name || null;
        this.update_time = new Date().getTime();
        this.status = 1;
    }
    copyFromInsert(lang: AddLang, user_id: number) {
        this.en = Utils.checkStringNull(lang.en);
        this.ja = Utils.checkStringNull(lang.ja);
        this.ko = Utils.checkStringNull(lang.ko);
        this.sk = Utils.checkStringNull(lang.sk);
        this.cs = Utils.checkStringNull(lang.cs);
        this.fr = Utils.checkStringNull(lang.fr);
        this.es = Utils.checkStringNull(lang.es);
        this.not_trans = lang.not_trans;
        this.descripe = Utils.checkStringNull(lang.descripe);
        this.label = Utils.checkStringNull(lang.label);
        this.file_name = Utils.checkStringNull(lang.file_name);
        this.project_id = lang.project_id;
        this.user_id = user_id;
        this.mode_name = lang.mode_name;
        this.create_time = new Date().getTime();
        this.status = 2;
    }
}