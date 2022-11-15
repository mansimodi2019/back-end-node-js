import fetch from "jest-fetch-mock";
import { findServer } from "../utils";

// jest.mock("cross-fetch/polyfill", () => jest.fn());

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
    jest.useFakeTimers();
  });
  it("renders correctly", () => {
    const fn = findServer;
    expect(fn).toMatchSnapshot();
  });
  it("should return online server with lowest priority", () => {
    fetch
      .mockResponseOnce(() =>
        Promise.resolve({
          status: 200,
        })
      )
      .mockResponseOnce(() => Promise.resolve("online"))
      .mockResponseOnce(() => Promise.resolve("online"))
      .mockResponseOnce(() => Promise.reject("offline"));
    jest.runAllTimers();
    findServer(mockServers)
      .then((val) => expect(val).toEqual("www.bing.com"))
      .catch((err) => expect(err).toEqual("no servers are online"));

    // expect(fetch.mock.calls.length).toEqual(mockServers.length);
  });
  it("should show offline message", async () => {
    fetch
      .mockResponseOnce(() => Promise.reject("offline"))
      .mockResponseOnce(() => Promise.reject("offline"))
      .mockResponseOnce(() => Promise.reject("offline"))
      .mockResponseOnce(() => Promise.reject("offline"));
    findServer(mockServers).catch((err) =>
      expect(err).toEqual("no servers are online")
    );
  });
});
