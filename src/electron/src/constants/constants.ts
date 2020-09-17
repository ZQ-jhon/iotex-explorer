import translations from "../../translations/en.yaml";

const bidContractAddress = "io16alj8sw7pt0d5wv22gdyphuyz9vas5dk8czk88";
const vitaTokens = [
  "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", // VITA Production
  "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m" // VITA Testnet
];
const multiChain = {
  current: process.env.CURRENT_CHAIN_NAME || "mainnet",
  chains: [
    {
      name: "mainnet",
      url: "https://iotexscan.io/"
    },
    {
      name: "testnet",
      url: "https://testnet.iotexscan.io/"
    }
  ]
};
const defaultERC20Tokens = [
  "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
  "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m"
];

const analytics = {
  googleTid: "UA-111756489-2",
  googleTidApp: "UA-111756489-15"
};

export const base = {
  bidContractAddress,
  vitaTokens,
  multiChain,
  defaultERC20Tokens,
  analytics,
  webBpApiGatewayUrl: "https://member.iotex.io/api-gateway/",
  enableSignIn: false,
  apiGatewayUrl: "https://iotexscan.io/api-gateway/",
  locale: "en",
  csrfToken: "itiKEcT0-ZQfe54u8YdmJn0MAXxZKKKIxqKg",
  translations
};
