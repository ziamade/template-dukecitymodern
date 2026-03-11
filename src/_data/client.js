// Static site config — contact info and hours are managed via the CMS (src/_data/*.json)
module.exports = {
    name: "Your Business Name",
    foundingYear: "2020",
    license: "",
    socials: {
        facebook: "#",
        instagram: "#",
        google: "#",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://yourbusiness.com",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
