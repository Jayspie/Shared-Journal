console.clear();
var FontAttributor = Quill.import("formats/font");
var fonts = ["Oliver", "courier", "comic", "Wawa"];
FontAttributor.whitelist = fonts;
Quill.register(FontAttributor, true);
Quill.register("modules/resize", window.QuillResizeImage);

var quill = new Quill("#container", {
  modules: {
    toolbar: {
      container: "#toolbar-container",
    },
    resize: {
      locale: {},
    },
  },
  placeholder: "What do you want to say?",
  theme: "snow",
});
