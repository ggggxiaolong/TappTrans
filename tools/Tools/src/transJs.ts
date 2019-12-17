import AllLang from './en'

class Language {
    key: string;
    value: string;
    model: string;

    constructor(key: string, value: string, model: string) {
        this.key = key;
        this.value = value;
        this.model = model;
    }
};

const langMap = new Map<string, Language>();

function trans() {
    Object.entries(AllLang).map(([model,entity]) => {
        Object.entries(entity).map(([key,value]) => {
            save2Map(model, key, value)
        })
    })
    console.log(langMap)
}

function save2Map(model: string, key: string, value: string) {
    langMap.set(key, new Language(key, value, model))
}

trans();