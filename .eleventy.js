module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicons");

  eleventyConfig.addCollection("service", collection =>
    collection.getFilteredByGlob("src/content/services/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addFilter("contains", (str, substr) =>
    (str || "").toLowerCase().includes((substr || "").toLowerCase())
  );

  eleventyConfig.addFilter("json", value => JSON.stringify(value));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
  };
};
