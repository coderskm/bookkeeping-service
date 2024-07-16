const LibraryNameValidator = function (value) {
  let name = value.trim();
  if (name.length === 0 && typeof name !== "string") return false;
  return true;
};

module.exports = { LibraryNameValidator };
