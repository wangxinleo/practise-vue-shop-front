const express = require('express')
// 导入gzip包
const compression = require('compression')
// const https = require('https')
// // 文件读取
// const fs = require('fs')
const app = express()
const port = 5440

// const options = {
// 	cert: fs.readFileSync('./full_chain.pem') // 导入SSL证书公钥
// 	key: fs.readFileSync('./private.key') // // 导入SSL证书私钥
// }

// 使用gzip减小文件体积，使传输更快
// 这行代码一定要写到 挂载静态资源之前
app.use(compression())
app.use(express.static('./dist'))

app.listen(port, () => {
  console.log(`server running at http://127.0.0.1:${port}`)
})

// // 开启https服务
// https.createServer(option, app).listen(443)
