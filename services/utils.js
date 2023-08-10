module.exports = {
  scapeSingleQuotes: string => {
    if (string !== null && string.length > 0 && string !== undefined) {
      return string.replaceAll("'", '&#39;')
    }
    return 'unknown'
  }
}
