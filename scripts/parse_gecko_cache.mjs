import fs from "node:fs/promises";

const REVENUE_RATE = 0.0001 * 0.33;
const rows = [
  ["01_Hyperlane.json", "0x0d3944cb515ecae653e6cc85eeebc1ec1505871b", "Hyperlane", "4/22/2025", "HYPER"],
  ["02_OKZOO.json", "0xb433ae7e7011a2fb9a4bbb86140e0f653dcfcfba", "OKZOO", "4/25/2025", "AIOT"],
  ["03_MilkyWay.json", "0xd26d38408a6ac6faff6fdfa92b5910ced2e5fd31", "MilkyWay", "4/29/2025", "MILK"],
  ["04_BSquared.json", "0xc1a780989734a0e5df875cebe410748562e1c5e6", "BSquared", "4/30/2025", "B2"],
  ["05_MYX.json", "0x6ec31af1bb9a72aacec12e4ded508861b05f4503", "MYX Finance", "5/6/2025", "MYX"],
  ["06_Privasea.json", "0x2b90a064ec039b55fd68e59c20975558f01cd5d8", "Privasea", "5/14/2025", "PRAI"],
  ["07_AlayaAI.json", "0xd3cffc6b02a34dfc72f1350339031043a854599f", "Alaya AI", "5/16/2025", "AGT"],
  ["08_Allo.json", "0x757651b39d4d13509b60b5784ba0e504a8ef6691", "Allo", "5/22/2025", "RWA"],
  ["09_Eldeglade.json", "0xd6f20a50b022ea3e5899c5069c542a9a33e5d240", "Eldeglade", "5/27/2025", "ELDE"],
  ["10_Reddio.json", "0x9d920b757cc25adc47e5b1a5de67ff6ac87bdff1", "Reddio", "5/29/2025", "RDO"],
  ["11_CUDIS.json", "0xa10c53b6846658e8f2a4693d0541bd9b6bb2c612", "CUDIS", "6/5/2025", "CUDIS"],
  ["12_MEET48.json", "0xfff4857a955b2b460c27fd431aa5a85fabca5559", "MEET48", "6/11/2025", "IDOL"],
  ["13_KAI.json", "0x5c8070edd88b6383ad2b62124fd7247d0b109199", "KAI-Battle of 3 Kingdom", "6/13/2025", "SGC"],
  ["14_Bombie.json", "0xfb1486d3a2a5e757597f0ffa5ccd1e4d1e3ae33e", "Bombie", "6/17/2025", "BOMB"],
  ["15_DAOBase.json", "0xb8a3a3789b351ed3a8da1ba69f859a2905965d5b", "DAOBase", "6/18/2025", "BEE"],
  ["16_LOT.json", "0x532f514fa9038a7bfa9da1740d77b99c1e9e7d21", "League of Traders", "6/20/2025", "LOT"],
  ["17_NODE.json", "0xd741e051815f4cd350ffd1f4bba800f1df62b828", "NODE", "6/30/2025", "NODE"],
  ["18_Palio.json", "0x194fb07e51eeb6fec9eae4edad6523f8dff2c7ed", "Palio", "7/7/2025", "PAL"],
  ["19_Velvet.json", "0x5d2913a8ea284e486000177852c87ea4d64d03d6", "Velvet", "7/10/2025", "VELVET"],
  ["20_Delphius.json", "0x3b426cff2e9b843406f5f0689017bb5d4b88f671", "Delphius", "7/22/2025", "ZKWASM"],
  ["21_Delabs.json", "0x52a499d86a824cf7ca5a5f964226066b825fdbd6", "Delabs", "7/28/2025", "DELABS"],
  ["22_CherryAI.json", "0xd3774ab0fd42708095a72e865b2e282e20b0d255", "CherryAI", "8/14/2025", "AIBOT"],
  ["23_RICE.json", "0x2afdf2cd0384a3b5d7836b70c8da5e73841ba826", "RICE AI", "8/18/2025", "RICE"],
  ["24_Mitosis.json", "0xdaf84e35ca400d7641456e53b6a8a30cccecfd5b", "Mitosis", "8/28/2025", "MITO"],
  ["25_Zeeverse.json", "0xf0601427e3bfc416bc7838fb9e15c6f0f56f4aa0", "Zeeverse", "9/1/2025", "FOREST"],
  ["26_StarPower.json", "0xb4db9fcda97fd7b02eaf1e8317e6ddb04bacc1af", "StarPower", "9/6/2025", "STAR"],
  ["27_JojoWorld.json", "0xd14e5639f8bc41fcd66ea571f29780b9c7927ff4", "JojoWorld", "9/19/2025", "JOJO"],
  ["28_Klink.json", "0x468ab8fd260878ebd44b7a28ceab5f052e4833d2", "Klink", "10/7/2025", "KLINK"],
  ["29_LAB.json", "0x2f62969A74159bfC9365d8Cd29aE8F6D15582204", "LAB", "10/15/2025", "LAB"],
  ["30_aPriori.json", "0xff84bf0ab4772bfa399b42b2633617a08506dfd8ba6fb3b7a782b3c021c0bba1", "aPriori", "10/23/2025", "APR"],
  ["31_TeaFi.json", "0xef6de770eb707785921ab0d33af3734a063cdbe6294ba7e154b6d47abe1c5572", "Tea-Fi", "11/2/2025", "TEA"],
  ["32_Infrared.json", "0xd9b7a1d544432b0bacac321ccf543f3a23ae55de9709b2cf6664ab83f4cbe0a4", "Infrared", "12/17/2025", "IR"],
  ["33_Fanable.json", "0xef470f9ae8512d2762e4f1cd91ae58caea17143afa61b8d56e9b20c8f87688c4", "Fanable", "12/27/2025", "COLLECT"],
  ["34_ZenChain.json", "0x1da0ad2e54147b95fa88e01a8d66576c820227b99d5ca15ab890745cd1198d00", "ZenChain", "1/7/2026", "ZTC"],
  ["35_Unitas.json", "0x8e1f18ede985e42ff7a293f8c70d7f7df242a8761818d0b58a77763d79372a3e", "Unitas", "3/13/2026", "UP"],
  ["36_OpenGradient.json", "0x0636066cec43597b2eb9e743a7c0e82c58c6bffaba22dae7bc5b012d37d6c751", "OpenGradient", "4/21/2026", "OPG"],
];

function startTimestamp(date) {
  const [month, day, year] = date.split("/").map(Number);
  return Date.UTC(year, month - 1, day) / 1000;
}

function isoDate(timestamp) {
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const outputRows = [];
for (const [file, pool, project, idoDate, token] of rows) {
  const raw = await fs.readFile(`outputs/gecko_cache/${file}`, "utf8");
  const json = JSON.parse(raw);
  const apiError = json.status?.error_code || json.errors;
  const candles = json.data?.attributes?.ohlcv_list || [];
  const since = startTimestamp(idoDate);
  const included = candles.filter(([timestamp]) => timestamp >= since);
  const totalVolume = included.reduce((sum, candle) => sum + (Number(candle[5]) || 0), 0);
  const base = json.meta?.base || {};
  const quote = json.meta?.quote || {};
  outputRows.push({
    pool,
    project,
    idoDate,
    token,
    network: "bsc",
    base: base.symbol || "",
    quote: quote.symbol || "",
    coingeckoCoinId: base.coingecko_coin_id || "",
    firstCandle: included.length ? isoDate(Math.min(...included.map(([timestamp]) => timestamp))) : "",
    lastCandle: included.length ? isoDate(Math.max(...included.map(([timestamp]) => timestamp))) : "",
    candleDays: included.length,
    totalVolume,
    revenue: totalVolume * REVENUE_RATE,
    status: apiError ? "api_error" : "ok",
    note: apiError ? JSON.stringify(json.status || json.errors) : "",
  });
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
  "first_candle",
  "last_candle",
  "candle_days",
  "total_volume_usd",
  "pancakeswap_revenue_usd",
  "status",
  "note",
];

const csv = [
  headers.join(","),
  ...outputRows.map((row) => [
    row.pool,
    row.project,
    row.idoDate,
    row.token,
    row.network,
    row.base,
    row.quote,
    row.coingeckoCoinId,
    row.firstCandle,
    row.lastCandle,
    row.candleDays,
    row.totalVolume.toFixed(2),
    row.revenue.toFixed(2),
    row.status,
    row.note,
  ].map(csvCell).join(",")),
].join("\n");

await fs.writeFile("outputs/pancakeswap_alpha_revenue_geckoterminal.csv", `${csv}\n`);

const okRows = outputRows.filter((row) => row.status === "ok");
const totalVolume = okRows.reduce((sum, row) => sum + row.totalVolume, 0);
const totalRevenue = okRows.reduce((sum, row) => sum + row.revenue, 0);
const top = [...okRows].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
console.log(JSON.stringify({
  rows: outputRows.length,
  okRows: okRows.length,
  apiErrorRows: outputRows.length - okRows.length,
  totalVolumeUsd: Number(totalVolume.toFixed(2)),
  totalRevenueUsd: Number(totalRevenue.toFixed(2)),
  output: "outputs/pancakeswap_alpha_revenue_geckoterminal.csv",
  topRevenueRows: top.map((row) => ({
    project: row.project,
    token: row.token,
    volume: Number(row.totalVolume.toFixed(2)),
    revenue: Number(row.revenue.toFixed(2)),
  })),
}, null, 2));
