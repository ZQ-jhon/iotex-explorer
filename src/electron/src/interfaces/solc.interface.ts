export interface ISolc {
  builds: Array<Build>;
  releases: Releases;
  latestRelease: string;
}

interface Releases {
  [key: string]: string;
}

interface Build {
  path: string;
  version: string;
  build: string;
  longVersion: string;
  keccak256: string;
  urls: Array<string>;
  prerelease?: string;
}
