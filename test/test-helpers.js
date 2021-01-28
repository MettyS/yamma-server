module.exports = {
  resetIdSeq: (db, seqName) => db.raw(`select setval( ?, 1, false)`, seqName),
};
