import { findServer } from "./utils";

const serverList = [
  {
    url: "https://does-not-work.perfume.new",
    priority: 1,
  },
  {
    url: "https://gitlab.com",
    priority: 4,
  },
  {
    url: "http://app.scnt.me",
    priority: 3,
  },
  {
    url: "https://offline.scentronix.com",
    priority: 2,
  },
];

findServer(serverList)
  .then((url: string) => {
    console.log(url);
  })
  .catch((err: string) => {
    console.log(err);
  });
