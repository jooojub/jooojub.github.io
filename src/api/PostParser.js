import posts from "../posts/list.json";

class PostParser {
  constructor() {
    this.tags = []; // {value: tag, count: cnt}
    this.date = []; // {value: date, count: cnt}
  }

  tagToString(tag) {
    return tag.replace("_", " ");
  }

  stringToTag(tag) {
    return tag.replace(" ", "_");
  }

  getTags() {
    if (this.tags.length !== 0) return this.tags;

    var tmp_tags = [];
    const tags_cnt = {};

    posts.forEach((post) => {
      post.tags.split(",").forEach((tag) => {
        const key = tag.trim();
        tmp_tags.push(key);

        if (isNaN(tags_cnt[key])) tags_cnt[key] = 0;

        tags_cnt[key]++;
      });
    });

    tmp_tags = [...new Set(tmp_tags)];

    tmp_tags.forEach((tag) => {
      this.tags.push({ value: tag, count: tags_cnt[tag] });
    });

    return this.tags;
  }

  getDate() {
    if (this.date.length !== 0) return this.date;

    var tmp_date = [];
    const date_cnt = {};

    posts.forEach((post) => {
      const date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
      }).format(new Date(post.date));

      tmp_date.push(date);

      if (isNaN(date_cnt[date])) date_cnt[date] = 0;

      date_cnt[date]++;
    });

    tmp_date = [...new Set(tmp_date)];

    tmp_date.forEach((date) => {
      this.date.push({ value: date, count: date_cnt[date] });
    });

    return this.date;
  }

  getWithTag(tag) {
    const result = [];

    posts.forEach((post) => {
      post.tags.split(",").forEach((t) => {
        const key = t.trim();
        if (key === tag) {
          result.push(post);
          return;
        }
      });
    });

    return result;
  }

  getWithDate(date) {
    const result = [];

    posts.forEach((post) => {
      const post_date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
      }).format(new Date(post.date));

      if (post_date === date)
        result.push(post);
    })

    return result;
  }
}

export default PostParser;
