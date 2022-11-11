const fetchMock = require("jest-fetch-mock");
const { findServer } = require("./utils");
fetchMock.enableFetchMocks();

const mockServers = [
  {
    url: "www.google.com",
    priority: 4,
  },
  {
    url: "www.bing.com",
    priority: 1,
  },
  {
    url: "www.yahoo.com",
    priority: 2,
  },
  {
    url: "www.offline-yfinance.com",
    priority: 3,
  },
];

describe("findServer function should call", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it("renders correctly", () => {
    const fn = findServer;
    expect(fn).toMatchSnapshot();
  });
  it("should return online server with lowest priority", async () => {
    fetch
      .mockResponseOnce(() => Promise.resolve("result"))
      .mockResponseOnce(() => Promise.resolve("result"))
      .mockResponseOnce(() => Promise.resolve("result"))
      .mockResponseOnce(() => Promise.reject("no server is online"));

    await findServer(mockServers).then((val) =>
      expect(val).toEqual("www.bing.com")
    );
    expect(fetch.mock.calls.length).toEqual(mockServers.length);
  });
  it("should show offline message", async () => {
    fetch
      .mockResponseOnce(() => Promise.reject(""))
      .mockResponseOnce(() => Promise.reject(""))
      .mockResponseOnce(() => Promise.reject(""))
      .mockResponseOnce(() => Promise.reject(""));
    findServer(mockServers).catch((err) =>
      expect(err).toEqual("no servers are online")
    );
  });
});
