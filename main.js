const { app, BrowserWindow } = require('electron')

function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js',
            javascript: true,
            plugins: true
            // webSecurity: false
            // nodeIntegration: false,
            // allowDisplayingInsecureContent: true,
            // allowRunningInsecureContent: true
        }
    })

    // 加载index.html文件
    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools()
}

// app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
app.whenReady().then(() => {
    createWindow()
})
