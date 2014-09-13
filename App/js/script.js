// var myDropzone = new Dropzone("div#awesome", { url: "/"});
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
// Get the current window
var win = gui.Window.get();


window.ondragover = window.ondrop = function(e) { e.preventDefault(); return false; }

var el = document.querySelector('#awesome');

el.ondragover = function(){
  this.className = 'hover';
  this.innerHTML = 'Drop your spectate file'
  return false;
}

el.ondragleave = function(){
  this.className = '';
  this.innerHTML = 'Drop your spectate file here'
  return false;
}

el.ondrop = function(e) {
  e.preventDefault();
  console.log(e.dataTransfer.files[0]);

  var file = e.dataTransfer.files[0];

  var ext = path.extname(file.path);
  if(ext != '.bat') {
    alert('Wrong file type');
    return false;
  }
  console.log(ext);

  var batFileA = fs.readFileSync(file.path).toString().split("\n");
  // if(batFileA[144] != 'echo EN: Cannot found LOL directory path for automatic. Please see our spectate help page: http://www.op.gg/help/observer') {
  //   alert('Wrong file type');
  //   return false;
  // } 

  console.log(batFileA[138]);
  strSrv = batFileA[138].split("\"");
  console.log(strSrv[11]);

  var child;

  child = exec('chmod -R 777 /Applications/League\\ of\\ Legends.app/Contents && cd /Applications/League\\ of\\ Legends.app/Contents/LOL/RADS/solutions/lol_game_client_sln/releases/*/deploy/LeagueOfLegends.app/Contents/MacOS && riot_launched=true /Applications/League\\ of\\ Legends.app/Contents/LOL/RADS/solutions/lol_game_client_sln/releases/*/deploy/LeagueOfLegends.app/Contents/MacOS/LeagueofLegends 8394 LoLLauncher /Applications/League\\ of\\ Legends.app/Contents/LOL/RADS/projects/lol_air_client/releases/*/deploy/bin/LolClient "'+strSrv[11]+'"', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });

}

Mousetrap.bind(['command+q', 'command+w', 'command+option+esc'], function(e) {
    window.close();
});
Mousetrap.bind('command+m', function(e){
  win.minimize();
})
