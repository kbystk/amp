const { writeFileSync } = require("fs");
const { Readable } = require("stream");
const { SitemapStream, streamToPromise } = require("sitemap");
const master = require("./data/pub.json");

const links = master.map((page) => ({
  url: `/${page.id}.html`,
  lastmod: new Date(page.updated * 1000).toISOString(),
}));
const stream = new SitemapStream({
  hostname: "https://amp.kbys.tk",
  cacheTime: 600000,
});

(async () => {
  const xml = await streamToPromise(Readable.from(links).pipe(stream));
  writeFileSync("./public/sitemap.xml", xml);
})();
