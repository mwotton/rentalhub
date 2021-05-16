import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load() {
  var worker = await createDbWorker(
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
    return worker;
}

async function runQuery(worker_: Promise<WorkerHttpvfs>, q: String) {
    const worker = await worker_;
    const result = await worker.db.query(q);
    document.body.textContent = JSON.stringify(result);
}

const worker = load();
runQuery(worker, `select * from posts`);
