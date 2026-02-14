function emitEvent(name, payload = {}) {
  console.log("ANALYTICS EVENT:", {
    event: name,
    ...payload,
  });
}
module.exports = { emitEvent };
