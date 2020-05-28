const express = require('express')
const app = express()
const port = 5440

app.use(express.static('./dist'))

app.listen(port, () => {
	console.log(`server running at http://127.0.0.1:${port}`)
})