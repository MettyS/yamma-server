module.exports = {
  resetIdSeq: (db, tableName) => db.raw(`select serval('?_id_seq', 1, false)`, tableName),

}
