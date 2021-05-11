const path = require("path");
const tmp = require("tmp");
const test = require("tape");
const UpgradeManager = require("../lib/upgrade-manager");
const fs = require("fs");
const http = require("http");
const getport = require("getport");
const collect = require("collect-stream");
const rimraf = require("rimraf");
const clone = require("clone");

function makeUpgradeManager(dir, port) {
  const opts = {
    dir,
    port,
    currentVersion: "0.0.0",
  };
  const manager = new UpgradeManager(opts);
  return {
    manager,
    // XXX: temp hack until UpgradeServer runs its own http server
    server: manager.server,
  };
}

function startServer(cb) {
  getport((err, port) => {
    if (err) return cb(err);

    const dir = tmp.dirSync().name;
    const { manager } = makeUpgradeManager(dir, port);
    function cleanup() {
      manager.on("state", (state, ctx) => {
        if (
          state.server.state === 1 &&
          state.downloader.search.state === 1 &&
          state.downloader.download.state === 1
        ) {
          rimraf.sync(dir);
        }
      });
      manager.stopServices();
    }
    cb(null, port, manager, cleanup);
  });
}

test("integration: empty GET /list result", t => {
  t.plan(4);

  startServer((err, port, manager, cleanup) => {
    t.error(err);
    manager.startServices();
    http.get({ hostname: "localhost", port, path: "/list" }, res => {
      t.equals(res.statusCode, 200);
      collect(res, (err, buf) => {
        t.error(err);
        try {
          const data = JSON.parse(buf.toString());
          t.deepEquals(data, []);
          cleanup();
        } catch (err) {
          t.error(err);
        }
      });
    });
  });
});

test("integration: can find + download + check an upgrade", t => {
  t.plan(11);

  const expectedHash =
    "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041";
  const expectedData = fs.readFileSync(
    path.join(__dirname, "static", "fake.apk")
  );
  const expectedOption = {
    hash: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
    size: 10,
    version: "1.0.0",
    hashType: "sha256",
    platform: "android",
    arch: ["arm64-v8a"],
    id: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
  };

  // Peer 2
  const dir2 = tmp.dirSync().name;
  const { manager: manager2 } = makeUpgradeManager(dir2, 0);

  // Peer 1
  startServer((err, port, manager, cleanup) => {
    t.error(err, "server started ok");
    const apkPath = path.join(__dirname, "static", "fake.apk");
    manager.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err, "apk info set ok");
      awaitFoundUpgrade(() => {
        awaitDownloaded(() => {
          awaitChecked(() => {
            manager2.stopServices();
            cleanup();
          });
        });
      });
      manager.startServices();
      manager2.startServices();
      function awaitFoundUpgrade(cb) {
        manager2.on("state", onState);
        function onState(state) {
          const search = state.downloader.search;
          if (
            search.state === "SEARCHING" &&
            search.context.upgrades.length > 0
          ) {
            t.equals(search.context.upgrades.length, 1, "upgrade found ok");
            const check = clone(search.context.upgrades[0]);
            delete check.host;
            delete check.port;
            t.deepEquals(check, expectedOption);
            manager2.removeListener("state", onState);
            cb();
          }
        }
      }

      function awaitDownloaded(cb) {
        let done = false;
        let lastProgress = null;
        manager2.on("state", onState);
        function onState(state) {
          if (done) return;
          if (state.downloader.download.state === "DOWNLOADING") {
            lastProgress = state.downloader.download.context;
          }
          if (state.downloader.download.state === "IDLE") {
            t.equals(lastProgress.sofar, 10);
            t.equals(lastProgress.total, 10);
            done = true;
            manager2.removeListener("state", onState);
            cb();
          }
        }
      }

      function awaitChecked(cb) {
        manager2.on("state", onState);

        function onState(state) {
          if (state.downloader.check.state === "AVAILABLE") {
            t.equals(
              path.basename(state.downloader.check.context.filename),
              expectedHash,
              "hash ok"
            );
            manager2.removeListener("state", onState);

            manager2.storage.getAvailableUpgrades((err, options) => {
              t.error(err, "got local upgrade options ok");
              t.equals(options.length, 1);

              const rs = manager2.storage.createReadStream(
                path.basename(state.downloader.check.context.filename)
              );
              collect(rs, (err, buf) => {
                t.error(err);
                t.ok(buf.equals(expectedData), "data matches");
                cb();
              });
            });
          }
        }
      }
    });
  });
});
