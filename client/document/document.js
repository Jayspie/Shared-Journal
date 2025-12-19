console.clear();
export const con = window.context;
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
if (con) {
  quill.setContents(con);
}

async function save() {
  const pathname = window.location.pathname.replaceAll("/", " ");
  const rawResponse = await fetch("/save", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      user_id: pathname.split(" ")[1],
      uuid: pathname.split(" ")[3],
      doc_info: quill.getContents(),
    }),
  })
    .then(async (response) => {
      const data = await response.json();
    })
    .catch((error) => {
      console.error("Clock-In Error:", error);
    });
  console.log("done");
}
setInterval(save, 30000);
