// True when every character of `pattern` appears in `text` in order (not
// necessarily next to each other), ignoring case. An empty pattern matches
// everything. This is the matching the `fuzzy` package did.
const fuzzyMatch = (pattern, text) => {
  const p = String(pattern ?? '').toLowerCase();
  const t = String(text ?? '').toLowerCase();
  let at = 0;
  for (let i = 0; i < p.length; i += 1) {
    at = t.indexOf(p[i], at);
    if (at === -1) return false;
    at += 1;
  }
  return true;
};

export default fuzzyMatch;
