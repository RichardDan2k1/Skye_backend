const http = require("http");

http.createServer((req,res)=>{
    res.write("Server is up and Running");
    res.end()
})
.listen(5000);
