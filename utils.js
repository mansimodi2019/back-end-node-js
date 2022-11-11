require("cross-fetch");
require("cross-fetch/polyfill");

const findServer = async (data) => {
  const result = await Promise.allSettled(
    data.map((d) =>
      fetch(d.url, {
        timeout: 5000,
      })
    )
  );
  const urls = result
    .map((promise, idx) => (promise.status === "fulfilled" ? data[idx] : false))
    .filter((v) => v)
    .sort((a, b) => (a.priority > b.priority ? 1 : -1));

  if (urls.length) {
    return Promise.resolve(urls[0].url);
  }
  return Promise.reject("no servers are online");
};

module.exports = { findServer };
