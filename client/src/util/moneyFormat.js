
// 1000
export const moneyFormat = (val)=>{
    if(isNaN(val)) return '0'
    if(!val) return '0'
    let my = val.toString()
    let result = ''
    let index = 0
    for (let i = my.length-1; i >=0; i--) {
        result = my[i] + result
        index++
        if(index==3 && i > 0){
            index = 0
            result = ','+result
        }
    }
    return result
}