function compareKeys(objSrc, objTgt) {
    var objSrcKeys = Object.keys(objSrc).sort();
    var objTgtKeys = Object.keys(objTgt).sort();
    return JSON.stringify(objSrcKeys) === JSON.stringify(objTgtKeys);
}

export default compareKeys;