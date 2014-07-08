"use strict;"
// var Events = function() {

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});

/* Home View Start tracking button */
document.querySelector("#btn-start").addEventListener ("click", function () {
  Controller.toggleWatch();
  // document.getElementById("views").showCard(1);
});

/* Home View settings button */
document.querySelector("#btn-settings").addEventListener ("click", function () {
  document.getElementById("views").showCard(0);
});

/*----------------- Infos View -----------------*/
/* Infos View Stop button */
// document.querySelector("#btn-stop").addEventListener ("click", function () {
//     document.getElementById("views").showCard(3);
// });

/* Infos Map button */
// document.querySelector("#btn-map").addEventListener ("click", function () {
//   console.log("flipping!");
//   document.getElementById("infos-flipbox").toggle();
//   Controller.flippingTrack(document.getElementById("infos-flipbox").flipped);
// });



/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
    Controller.stopWatch();
});
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  Controller.savingSettings("screen", this.checked);
  Controller.toogleScreen(this.checked);
  console.log("this.checked", this.checked);
};
/* Settings View Language selection */
document.querySelector("#language").onchange = function() {
  var dom = document.querySelector("#language");
  var id = this.selectedIndex;
  Controller.savingSettings("language", dom[id].value);
  Controller.changeLanguage(dom[id].value);
};
/* Settings View Distance unit selection */
document.querySelector("#distance").onchange = function() {
  var dom = document.querySelector("#distance");
  var id = this.selectedIndex;
  Controller.savingSettings("distance", dom[id].value);
  Controller.changeDistance(dom[id].value);
};
/* Settings View Speed unit selection */
document.querySelector("#speed").onchange = function() {
  var dom = document.querySelector("#speed");
  var id = this.selectedIndex;
  Controller.savingSettings("speed", dom[id].value);
  Controller.changeSpeed(dom[id].value);
};
/* Settings View Position unit selection */
document.querySelector("#position").onchange = function() {
  var dom = document.querySelector("#position");
  var id = this.selectedIndex;
  Controller.savingSettings("position", dom[id].value);
  Controller.changePosition(dom[id].value);
};
/* Settings View Back button */
document.querySelector("#btn-settings-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});


/*----------------- Tracks View -----------------*/
/* Tracks View Back button */
document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});

/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(3);
});
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  document.getElementById("views").showCard(5);
});
/* Track View Rename button */
document.querySelector("#btn-rename").addEventListener("click", function() {
  console.Log("renaming");
  document.getElementById("views").showCard(6);
});
/* Rename Cancel button */
document.querySelector("#btn-cancel-rename").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
});
/* Rename Confirm button */
document.querySelector("#btn-confirm-rename").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
  var new_name = document.querySelector("#input-rename");
  Controller.renameTrack(new_name.value);
});



/* Track View Share button */
document.querySelector("#btn-share").addEventListener("click", function() {
  console.Log("exporting");
  document.getElementById("views").showCard(7);
  Controller.shareTrack();
});

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(4);
});
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(3);
  Controller.deleteTrack();
});





// }();





/* TEMPORARY TRACK SELECTION */
// document.querySelector("#TR-2014421-15195").addEventListener("click", function () {
//   document.getElementById("views").showCard(5);
//   Controller.displayTrack(testdata);
// });