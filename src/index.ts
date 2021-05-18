import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";
import $ from "jquery";
import "tabulator-tables";

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

    var table = new Tabulator('#querytable', {
	data: result,
	autoColumns: true
    });
}

const worker = load();

// runQuery(worker, `select 'https://www.facebook.com/groups/'||group_id||'/permalink/'||post_id,price,sqm,number_of_rooms from (select posts.post_id,posts.group_id,posts.sqm,posts.post_text,posts.number_of_rooms,price.price from posts join price on price.post_id=posts.post_id where price.currency='USD' UNION select posts.post_id,posts.group_id,posts.sqm,post_text,posts.number_of_rooms,0.000043*price.price from posts join price on price.post_id=posts.post_id where price.currency='VND')   order by number_of_rooms asc,price asc,sqm asc limit 20;`);

runQuery(worker, `select posts.post_id,posts.group_id,posts.sqm,posts.number_of_rooms,price.price from posts join price on price.post_id=posts.post_id where price.currency='USD'`);
