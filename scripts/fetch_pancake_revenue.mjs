import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const rowsText = `0x0d3944cb515ecae653e6cc85eeebc1ec1505871b	Hyperlane	4/22/2025	HYPER
0xb433ae7e7011a2fb9a4bbb86140e0f653dcfcfba	OKZOO	4/25/2025	AIOT
0xd26d38408a6ac6faff6fdfa92b5910ced2e5fd31	MilkyWay	4/29/2025	MILK
0xc1a780989734a0e5df875cebe410748562e1c5e6	BSquared	4/30/2025	B2
0x6ec31af1bb9a72aacec12e4ded508861b05f4503	MYX Finance	5/6/2025	MYX
0x2b90a064ec039b55fd68e59c20975558f01cd5d8	Privasea	5/14/2025	PRAI
0xd3cffc6b02a34dfc72f1350339031043a854599f	Alaya AI	5/16/2025	AGT
0x757651b39d4d13509b60b5784ba0e504a8ef6691	Allo	5/22/2025	RWA
0xd6f20a50b022ea3e5899c5069c542a9a33e5d240	Eldeglade	5/27/2025	ELDE
0x9d920b757cc25adc47e5b1a5de67ff6ac87bdff1	Reddio	5/29/2025	RDO
0xa10c53b6846658e8f2a4693d0541bd9b6bb2c612	CUDIS	6/5/2025	CUDIS
0xfff4857a955b2b460c27fd431aa5a85fabca5559	MEET48	6/11/2025	IDOL
0x5c8070edd88b6383ad2b62124fd7247d0b109199	KAI-Battle of 3 Kingdom	6/13/2025	SGC
0xfb1486d3a2a5e757597f0ffa5ccd1e4d1e3ae33e	Bombie	6/17/2025	BOMB
0xb8a3a3789b351ed3a8da1ba69f859a2905965d5b	DAOBase	6/18/2025	BEE
0x532f514fa9038a7bfa9da1740d77b99c1e9e7d21	League of Traders	6/20/2025	LOT
0xd741e051815f4cd350ffd1f4bba800f1df62b828	NODE	6/30/2025	NODE
0x194fb07e51eeb6fec9eae4edad6523f8dff2c7ed	Palio	7/7/2025	PAL
0x5d2913a8ea284e486000177852c87ea4d64d03d6	Velvet	7/10/2025	VELVET
0x3b426cff2e9b843406f5f0689017bb5d4b88f671	Delphius	7/22/2025	ZKWASM
0x52a499d86a824cf7ca5a5f964226066b825fdbd6	Delabs	7/28/2025	DELABS
0xd3774ab0fd42708095a72e865b2e282e20b0d255	CherryAI	8/14/2025	AIBOT
0x2afdf2cd0384a3b5d7836b70c8da5e73841ba826	RICE AI	8/18/2025	RICE
0xdaf84e35ca400d7641456e53b6a8a30cccecfd5b	Mitosis	8/28/2025	MITO
0xf0601427e3bfc416bc7838fb9e15c6f0f56f4aa0	Zeeverse	9/1/2025	FOREST
0xb4db9fcda97fd7b02eaf1e8317e6ddb04bacc1af	StarPower	9/6/2025	STAR
0xd14e5639f8bc41fcd66ea571f29780b9c7927ff4	JojoWorld	9/19/2025	JOJO
0x468ab8fd260878ebd44b7a28ceab5f052e4833d2	Klink	10/7/2025	KLINK
0x2f62969A74159bfC9365d8Cd29aE8F6D15582204	LAB	10/15/2025	LAB
0xff84bf0ab4772bfa399b42b2633617a08506dfd8ba6fb3b7a782b3c021c0bba1	aPriori	10/23/2025	APR
0xef6de770eb707785921ab0d33af3734a063cdbe6294ba7e154b6d47abe1c5572	Tea-Fi	11/2/2025	TEA
0xd9b7a1d544432b0bacac321ccf543f3a23ae55de9709b2cf6664ab83f4cbe0a4	Infrared	12/17/2025	IR
0xef470f9ae8512d2762e4f1cd91ae58caea17143afa61b8d56e9b20c8f87688c4	Fanable	12/27/2025	COLLECT
0x1da0ad2e54147b95fa88e01a8d66576c820227b99d5ca15ab890745cd1198d00	ZenChain	1/7/2026	ZTC
0x8e1f18ede985e42ff7a293f8c70d7f7df242a8761818d0b58a77763d79372a3e	Unitas	3/13/2026	UP
0x0636066cec43597b2eb9e743a7c0e82c58c6bffaba22dae7bc5b012d37d6c751	OpenGradient	4/21/2026	OPG`;

const REVENUE_RATE = 0.0001 * 0.33;
const OUTPUT_PATH = "outputs/pancakeswap_alpha_revenue_geckoterminal.csv";
const NETWORKS = ["bsc", "monad", "berachain", "base", "ethereum", "arbitrum", "polygon_pos", "solana"];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseDateUtc(date) {
  const [month, day, year] = date.split("/").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 1000);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function getJson(url) {
  const { stdout } = await execFileAsync("curl", ["-s", String(url)], {
    maxBuffer: 20 * 1024 * 1024,
  });
  const text = stdout.trim();
  if (!text) {
    throw new Error("empty response");
  }
  const json = JSON.parse(text);
  if (json.errors || json.status?.error_code) {
    throw new Error(JSON.stringify(json.errors || json.status).slice(0, 240));
  }
  return json;
}

async function fetchOhlcv(network, pool, startTimestamp) {
  const volumeByDay = new Map();
  let before = Math.floor(Date.now() / 1000) + 86400;
  let meta = null;

  for (let page = 0; page < 8; page += 1) {
    const url = new URL(`https://api.geckoterminal.com/api/v2/networks/${network}/pools/${pool}/ohlcv/day`);
    url.searchParams.set("aggregate", "1");
    url.searchParams.set("limit", "1000");
    url.searchParams.set("before_timestamp", String(before));
    const json = await getJson(url);
    meta ||= json.meta || null;
    const candles = json.data?.attributes?.ohlcv_list || [];
    if (candles.length === 0) break;

    for (const candle of candles) {
      const [timestamp, , , , , volume] = candle;
      if (timestamp >= startTimestamp) {
        volumeByDay.set(timestamp, Number(volume) || 0);
      }
    }

    const oldest = candles[candles.length - 1][0];
    if (oldest < startTimestamp || oldest >= before) break;
    before = oldest - 1;
    await sleep(350);
  }

  return { meta, totalVolumeUsd: [...volumeByDay.values()].reduce((sum, volume) => sum + volume, 0) };
}

async function resolveAndFetch(row) {
  const startTimestamp = parseDateUtc(row.idoDate);
  const candidates = row.pool.length === 42 ? ["bsc"] : NETWORKS;
  const errors = [];

  for (const network of candidates) {
    try {
      const result = await fetchOhlcv(network, row.pool, startTimestamp);
      const base = result.meta?.base;
      const quote = result.meta?.quote;
      return {
        ...row,
        network,
        base: base?.symbol || "",
        quote: quote?.symbol || "",
        coingecko_coin_id: base?.coingecko_coin_id || "",
        total_volume_usd: result.totalVolumeUsd,
        pancake_revenue_usd: result.totalVolumeUsd * REVENUE_RATE,
        status: "ok",
        note: "",
      };
    } catch (error) {
      errors.push(`${network}: ${error.message}`);
      if (/429/.test(error.message)) await sleep(3000);
      else await sleep(250);
    }
  }

  return {
    ...row,
    network: "",
    base: "",
    quote: "",
    coingecko_coin_id: "",
    total_volume_usd: 0,
    pancake_revenue_usd: 0,
    status: "unresolved",
    note: errors.join(" | ").slice(0, 500),
  };
}

const inputRows = rowsText.trim().split("\n").map((line) => {
  const [pool, project, idoDate, token] = line.split("\t");
  return { pool, project, idoDate, token };
});

const results = [];
for (const [index, row] of inputRows.entries()) {
  console.error(`Fetching ${index + 1}/${inputRows.length}: ${row.project} ${row.pool}`);
  results.push(await resolveAndFetch(row));
}

const headers = [
  "pool",
  "project",
  "ido_date",
  "token",
  "network",
  "base",
  "quote",
  "coingecko_coin_id",
  "total_volume_usd",
  "pancake_revenue_usd",
  "status",
  "note",
];
const lines = [
  headers.join(","),
  ...results.map((row) =>
    [
      row.pool,
      row.project,
      row.idoDate,
      row.token,
      row.network,
      row.base,
      row.quote,
      row.coingecko_coin_id,
      row.total_volume_usd.toFixed(2),
      row.pancake_revenue_usd.toFixed(2),
      row.status,
      row.note,
    ].map(csvCell).join(",")
  ),
];

await fs.mkdir("outputs", { recursive: true });
await fs.writeFile(OUTPUT_PATH, `${lines.join("\n")}\n`);

const resolved = results.filter((row) => row.status === "ok");
const unresolved = results.filter((row) => row.status !== "ok");
const totalVolume = resolved.reduce((sum, row) => sum + row.total_volume_usd, 0);
const totalRevenue = resolved.reduce((sum, row) => sum + row.pancake_revenue_usd, 0);

console.log(JSON.stringify({
  output: OUTPUT_PATH,
  resolved: resolved.length,
  unresolved: unresolved.length,
  totalVolumeUsd: Number(totalVolume.toFixed(2)),
  totalRevenueUsd: Number(totalRevenue.toFixed(2)),
  unresolvedProjects: unresolved.map((row) => row.project),
}, null, 2));
