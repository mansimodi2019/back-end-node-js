// import fetch from "cross-fetch";
require("cross-fetch/polyfill");

const TIMEOUT = 5000; // 5sec

const withTimeout = (
  promise: Promise<any>,
  controller: AbortController,
  timeInMs: number
) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error("TIMEOUT"));
    }, timeInMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
};

const getStatus = (site: string) => {
  const controller = new AbortController();
  return withTimeout(
    fetch(site, {
      signal: controller.signal,
    }),
    controller,
    TIMEOUT
  );
};

export const findServer = async (data: IReqData["data"]): Promise<any> => {
  const result = await Promise.allSettled(data.map((d) => getStatus(d.url)));

  const urls: any[] = result
    .map((promise: any, idx) =>
      promise.status === "fulfilled" &&
      promise.value.status >= 200 &&
      promise.value.status <= 299
        ? data[idx]
        : false
    )
    .filter((v: any) => v)
    .sort((a: any, b: any) => (a.priority > b.priority ? 1 : -1));

  if (urls.length) {
    return Promise.resolve(urls[0].url);
  }
  return Promise.reject("no servers are online");
};

export type ServerDetail = {
  url: string;
  priority: number;
};

export interface IReqData {
  data: ServerDetail[];
}
