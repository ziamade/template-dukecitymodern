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

  eleventyConfig.addFilter("formatPhone", phone => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    if (digits.length === 11 && digits[0] === '1') return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
    return phone;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
  };
};
