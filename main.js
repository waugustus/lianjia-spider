const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const initSqlJs = require('sql.js');
const fs = require('fs')
const { PythonShell } = require('python-shell');

const config = require('./config/config.json');

let win;

var filebuffer = fs.readFileSync('./db/lianjia.db');

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  win.loadFile('./views/index.html')
  win.maximize()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on("toMain", (event, args) => {
  switch (args['type']) {
    case "index":
      initSqlJs().then(function (SQL) {
        // Load the db
        var db = new SQL.Database(filebuffer);
        var contents = db.exec("SELECT * FROM HOUSE");
        db.close();
        win.webContents.send("fromMain", {'host': config.host, 'contents': contents});
      });
      break;
    case "sellout":
      initSqlJs().then(function (SQL) {
        // Load the db
        var db = new SQL.Database(filebuffer);
        var contents = db.exec("SELECT * FROM SELLOUT");
        db.close();
        win.webContents.send("fromMain", {'host': config.host, 'contents': contents});
      });
      break;
    case "href":
      if ('id' in args) {
        win.loadFile('./views/' + args['target'], { query: { id: args['id'] } })
      } else {
        win.loadFile('./views/' + args['target'])
      }
      win.maximize()
      break;
    case "date":
      initSqlJs().then(function (SQL) {
        // Load the db
        var db = new SQL.Database(filebuffer);

        var contents = db.exec("SELECT * FROM HOUSE WHERE ID=" + args['id']);

        if (contents.length == 0) {
          contents = db.exec("SELECT * FROM SELLOUT WHERE ID=" + args['id']);
        }
        db.close();

        win.webContents.send("fromMain", {'host': config.host, 'contents': contents});
      });
      break;
    case "python":

      let pyshell = new PythonShell('./python_scripts/main.py');

      pyshell.on('message', function (message) {
        console.log(message);
      })

      pyshell.end(function (err) {
        if (err) {
          throw err;
        };
        win.loadFile('./views/index.html')
        win.maximize();
      });

    default:
      break;
  }
});

