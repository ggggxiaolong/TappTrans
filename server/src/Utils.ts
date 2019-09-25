export const Utils =  {
    checkStringNull: function (param: string) {
        if (param && 0 < param.length) {
            return param
        }
        return null
    }
}