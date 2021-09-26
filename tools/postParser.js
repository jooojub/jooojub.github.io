const path = require("path");
const fs = require("fs");

const POST_PATH = path.resolve(__dirname, "../posts/md/");
const JSON_OUTPUT_PATH = path.resolve(__dirname, "../posts/list.json");
const JSON_CONVERT_OUTPUT_PATH = path.resolve(__dirname, "../posts/json");
const json_output = [];

const getPostList = () => {
  return fs.readdirSync(POST_PATH);
};

const ParsingPosts = () => {
  const post_list = getPostList();

  const regexTitle = new RegExp('title:\\s+"(.+)"');
  const regexTag = new RegExp("tags:\\s+\\[(.+)\\]");
  const regexDate = new RegExp("date:\\s+(.+)");
  const regexDesc = new RegExp('description:\\s+"(.+)"');
  const regexContent = new RegExp("---[\\s\\S]+---([\\s\\S]+)");

  post_list.forEach((file) => {
    const data = fs.readFileSync(path.resolve(POST_PATH, file), "utf8");

    if (file === path.parse(JSON_OUTPUT_PATH).base) return;

    try {
      const json = {
        file: path.basename(file, ".md"),
        title: regexTitle.exec(data)[1],
        tags: regexTag.exec(data)[1],
        date: regexDate.exec(data)[1],
        description: regexDesc.exec(data)[1],
      };

      json_output.push(json);

      const js = {
        content: regexContent.exec(data)[1],
      };

      const js_path =
        JSON_CONVERT_OUTPUT_PATH + "/" + path.basename(file, ".md") + ".json";
      fs.writeFile(js_path, JSON.stringify(js, null, 1), function (err) {
        if (err) {
          console.log(err);
        }
      });
    } catch {
      console.log(file, "Parsing failed, Something wrong");
    }
  });

  fs.writeFile(
    JSON_OUTPUT_PATH,
    JSON.stringify(json_output, null, 1),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
};

ParsingPosts();
