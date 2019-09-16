import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Lang {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column("text")
    en: string;

    @Column("text")
    ja: string;

    @Column("text")
    ko: string;

    @Column("text")
    sk: string;

    @Column("text")
    cs: string;

    @Column("text")
    fr: string;

    @Column("text")
    es: string;

    // 0 是否不需要翻译 0：否，1：是
    @Column({ default: 0 })
    not_trans: number;

    @Column("text")
    descripe: string;

    @Column("text")
    label: string;

    @Column("text")
    file_name: string;

    @Column()
    project_id: number;

    @Column()
    new_user_id: number;

    @Column("text")
    new_en: string;

    @Column("text")
    new_ja: string;

    @Column("text")
    new_ko: string;

    @Column("text")
    new_sk: string;

    @Column("text")
    new_cs: string;

    @Column("text")
    new_fr: string;

    @Column("text")
    new_es: string;

    @Column()
    new_not_trans: number;

    @Column("text")
    new_descripe: string;

    @Column("text")
    new_label: string;

    @Column("text")
    new_file_name: string;

    @Column()
    new_project_id: number;

    // 0为最新，1为更新，2为新增
    @Column({ default: 0 })
    status: number;

    @Column()
    create_time: number

    @Column()
    update_time: number
}