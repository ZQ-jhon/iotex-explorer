import { ipcMain } from "electron";
import { error } from "electron-log";
import { IncomingMessage } from "http";
// tslint:disable-next-line:no-var-requires
const solc = require("solc");
import { get } from "https";
import MemoryStream from "memorystream";
import { ISolc } from "./interfaces/solc.interface";

let soljsonReleases: unknown = null;
const solcRefs = {};

const fetchJson = async (url: string) => {
  // tslint:disable-next-line:no-return-await
  return await new Promise((resolve, reject) => {
    // Using default configs for MemoryStream
    const mem = new MemoryStream(undefined, undefined);
    get(url, (response: IncomingMessage) => {
      if (response.statusCode !== 200) {
        reject(response.statusMessage);
      } else {
        response.pipe(mem);
        response.on("end", () => {
          resolve(JSON.parse(mem.toString()));
        });
      }
    }).on("error", reject);
  });
};

const fetchReleaseVersions = async () => {
  if (soljsonReleases) {
    return soljsonReleases;
  }
  try {
    const { releases } = (await fetchJson(
      "https://ethereum.github.io/solc-bin/bin/list.json"
    )) as Promise<ISolc>;
    soljsonReleases = releases;
  } catch (e) {
    error(e);
  }
  return soljsonReleases || {};
};

const loadSolc = async version => {
  if (solcRefs[version]) {
    return solcRefs[version];
  }
  const releases = await fetchReleaseVersions();

  if (!releases[version]) {
    throw new Error("wallet.cannot_find_solidity_version");
  }
  const releaseVersion = `${releases[version]}`.replace(/soljson-|\.js$/gi, "");
  return await new Promise((resolve, reject) => {
    solc.loadRemoteVersion(releaseVersion, (error, remoteSolc) => {
      if (error) {
        reject("wallet.cannot_load_solidity_version");
      } else {
        solcRefs[version] = remoteSolc;
        resolve(remoteSolc);
      }
    });
  });
};

// Prefetch release versions index.
fetchReleaseVersions();
module.exports.initSolc = async () => {
  ipcMain.on("solc", async (event, arg) => {
    if (!arg) {
      return;
    }
    const { id, source } = arg || {};
    if (!id || !source) return;
    const replyId = `solc-reply-${id}`;
    const verFound = /pragma solidity \^(.*);/.exec(source);
    if (!verFound || !verFound[1]) {
      event.reply(replyId, { error: "wallet.missing_solidity_pragma" });
      return;
    }
    try {
      const remoteSolc = await loadSolc(verFound[1]);
      const output = JSON.parse(remoteSolc.lowlevel.compileSingle(source));
      event.reply(replyId, output);
    } catch (e) {
      error(e);
      event.reply(replyId, { error: e.message });
    }
  });
};
