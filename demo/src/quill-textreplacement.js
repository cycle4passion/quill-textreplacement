Quill.register("modules/quicktext", function (quill, options) {
  let cache = "";

  quill.on("selection-change", (range, oldRange, source) => {
    if (source !== "silent" && range?.index !== 1) {
      cache = ""; // delete cache if user moves caret with keyboard or mouse
    }
  });

  quill.on("text-change", (delta, oldDelta, source) => {
    if (source !== "user") {
      cache = "";
      return;
    }
    let lastkey = delta.ops[delta.ops.length - 1]?.insert || "";
    console.log(lastkey, cache);
    if (delta.ops[delta.ops.length - 1]?.delete) {
      // handle delete key, keeps cache updated
      cache = cache.slice(0, -1);
      return;
    }
    if (lastkey !== " ") {
      cache += lastkey;
    } else if (cache) {
      reps.forEach((rep) => {
        if (rep[cache]) {
          let caret = quill.getSelection().index;
          let start = caret - cache.length - 1;
          let finalcaret = caret + rep[cache].length - cache.length;
          quill.deleteText(start, cache.length, "silent");
          quill.insertText(start, rep[cache], "silent");
          // quill.setSelection(finalcaret, 0) // this fails
          setTimeout(() => quill.setSelection(finalcaret, 0), 1); // this works
        }
      });
      cache = "";
    }
  });
});

let reps = [
  { ".hi": "hello" },
  { ".bye": "goodbye" },
  { ".brb": "be right back" }
];

var quill = new Quill("#editor", {
  modules: {
    quicktext: {
      reps: reps
    }
  }
});
