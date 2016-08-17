var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var settings = require("./job.json");

var nextstart = 0;

app.listen(8120);

function handler (req, res) {
  if(req.url=="/") req.url = "/index.html";
  if (req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
      var json = JSON.parse(body);
      var base64Data = json.data.replace(/^data:image\/png;base64,/, "");
      var str = "" + json.frame;
      var pad = "00000";
      var ans = pad.substring(0, pad.length - str.length) + str;
      fs.writeFile("frames/frame"+ans+".png", base64Data, 'base64', function(err) {});
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('ok');
    return;
  }
  fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(400);
      console.log(err);
      return res.end('Error');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  console.log(Date.now());
  socket.emit("size",settings);
  socket.on("ready",function() {
    if(nextstart>settings.length) {
      io.emit("done");
      completeJob();
      return;
    };
    var len = (nextstart+settings.chunk>=settings.length)?(nextstart+settings.chunk-settings.length):settings.chunk;
    socket.emit("render",{startFrame:nextstart,length:len});
    nextstart+=settings.chunk;
  });
  socket.on("framedone",function(data) {
    var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
    var str = "" + data.frame;
    var pad = "00000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    fs.writeFile("frames/frame"+ans+".png", base64Data, 'base64', function(err) {
      console.log(err);
    });
  });
});

function completeJob() {
  var exec = require('child_process').exec;
  var prc = exec("avconv -y -r "+settings.fps+" -i frames/frame%5d.png -r "+settings.fps+" -vcodec libx264 -q:v 3 -vf crop="+settings.width+":"+settings.height+",scale=iw:ih output.mp4;", function callback(error, stdout, stderr){
    // result
  });
  prc.stdout.on('data', function (data) {
      var str = data.toString()
      var lines = str.split(/(\r?\n)/g);
      console.log(lines.join(""));
  });

  prc.stderr.on('data', function (data) {
      var str = data.toString()
      var lines = str.split(/(\r?\n)/g);
      console.log(lines.join(""));
  });

  prc.on('close', function (code) {
      console.log('process exit code ' + code);
      console.log(Date.now());
      process.exit();
  });
}
