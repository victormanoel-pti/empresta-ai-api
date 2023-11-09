function isObjectKeysEmpty (obj) {
    for (const [value] of Object.entries(obj)) {
        return(value.length === 0);
      }
}

export default isObjectKeysEmpty;