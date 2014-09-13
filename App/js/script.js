var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var gui = require('nw.gui');
var win = gui.Window.get();

var LoLpath;
// Disable overall file drop
window.ondragover = window.ondrop = function(e) { e.preventDefault(); return false; }
// Activate mac shortcuts 
Mousetrap.bind(['command+q', 'command+w', 'command+option+esc'], function(e) {
    window.close();
});
Mousetrap.bind('command+m', function(e){
  win.minimize();
})

// Close alerts
$('.alert').on('click',function(){
  $(this).slideUp('50',function(){
    $(this).addClass('hidden');
  });
})

// functions
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}


// Try to find default League Of Legends.app
if (fs.existsSync("/Applications/League of Legends.app")) {
  // Do something
  console.log('client found');
  LoLpath = '/Applications/League of Legends.app';
  LoLpath = replaceAll(' ', '\\ ', LoLpath);
} else {
  console.log('client not found');
  // Hide .bat dropzone and display .app dropzone & alert
  $('#awesome').addClass('hidden');
  $('#lol-client').removeClass('hidden');
  $('#client-not-found').removeClass('hidden');
}

// .app file dropzone
var appzone = document.querySelector('#lol-client');

appzone.ondragover = function(){
  this.className = 'hover';
  this.innerHTML = 'Drop your <br>League Of Legends.app'
  return false;
}

appzone.ondragleave = function(){
  this.className = '';
  this.innerHTML = 'Drop your <br>League Of Legends.app here'
  return false;
}

appzone.ondrop = function(e) {
  e.preventDefault();
  console.log(e.dataTransfer.files[0]);

  var file = e.dataTransfer.files[0];

  var ext = path.extname(file.path);
  if(ext != '.app') {
    alert('Wrong file type');
    return false;
  }
  if(file.name != 'League of Legends.app') {
    alert('This app is not a valid League of Legends client');
    return false;
  }

  console.log(file.path)
  LoLpath = file.path;
  LoLpath = replaceAll(' ', '\\ ', LoLpath);
  console.log(LoLpath);

  // Display .bat dropzone and remove alert if it's still here
  $('#awesome').removeClass('hidden');
  $('#lol-client').addClass('hidden');
  if(!$('#client-not-found').hasClass('hidden')) {
    $('#client-not-found').slideUp('50',function(){
      $('#client-not-found').addClass('hidden');
    });
  }
}

// .bat file dropzone
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

  child = exec('chmod -R 777 '+LoLpath+'/Contents && cd '+LoLpath+'/Contents/LOL/RADS/solutions/lol_game_client_sln/releases/*/deploy/LeagueOfLegends.app/Contents/MacOS && riot_launched=true '+LoLpath+'/Contents/LOL/RADS/solutions/lol_game_client_sln/releases/*/deploy/LeagueOfLegends.app/Contents/MacOS/LeagueofLegends 8394 LoLLauncher '+LoLpath+'/Contents/LOL/RADS/projects/lol_air_client/releases/*/deploy/bin/LolClient "'+strSrv[11]+'"', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

// League of Legends.app dropzone
