import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

declare var worker: WorkerHttpvfs;

async function load() {
  worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "db.sqlite3.000",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

}

async function runQuery(q: String) {
    const result = await worker.db.query(q);
    document.body.textContent = JSON.stringify(result);
}

load();
runQuery(`select * from posts`);
