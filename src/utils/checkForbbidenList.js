function checkForbiddenList(list, target){
    for(let i = 0; i <= list.length; i++){
        if(list[i] === target){
            return true;
        }
    }
    return false;
}

export default checkForbiddenList;