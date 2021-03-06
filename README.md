# Run, Bike, Hike...

## Description

A GPS recording web app.

## Installation
* Stable : [Firefox marketplace](https://marketplace.firefox.com/app/run-bike-hike)
* Under development : [Github](http://nicodel.github.io/Run-Bike-Hike)

## Release notes

### v0.1.15 -
* Fix issue #93: Replace single quote by double quote to allow exported files to be imported in RunKeeper.

### v0.1.14 -
* Fix issue: Maq Quest API new token.

### v0.1.13 -
* Fix issue: More than 2 storage units.

### v0.1.12 -
* New language: German.
* Add feature #67: Better managment of device with multiple storage.
* Pull request #92: Open information lins in a new window.
* Pull request #91: Fix generated names and duration in impored tracks.
* Pull request #88: Adding decimal into the calcumation ressult of average speed.
* Pull request #84: Fixing removing child nodes on track list.
* Fix Issue #94: Mapquest request failure after API changes.

### v0.1.11 - 15/12/2014
* New language: Español.
* Fix issue #76: Elapsed time depending on timezone.
* Fix issue #77: Shared-by-email GPX file [Bug 1111724](https://bugzilla.mozilla.org/show_bug.cgi?id=1111724).
* Fix issue #73: Time not displayed in graph anymore.

### v0.1.10 - 11/12/2014
* Build process fixed.

### v0.1.9 - 08/12/2014
* Various locales fixed.

### v0.1.8 - 06/12/2014
* Add feature #30: Add import button (and give user the possibility to import tracks with GPX format file).
* Add feature #37: Ability to pause the ride (PR #60).
* Add feature #28: Let the user choose GPS refresh rate (PR #61).
* Fix issue #26 (again)...

### v0.1.7 - 06/11/2014
* Fix issue #25: Hours on stats graph are sometime cut.
* Fix issue #26: Average speed calculation error.
* Add feature #27: Adding version, contributors, credits and licence informations to Setting View.
* Add feature #33: Identify the type of sport done while recording track.
* Fix issue #36: Clean up git repository.
* Pull request #49: Make "Retreiving GPS signal" more readable.
* Pull request #50: Use full page height.
* Pull request #51: Avoid having scrollbar on main view with 320x480 display (eg: Keon).
* Issue #33 & Pull requests #35, #38: Identify the type of sport used during a recorded track.

### v0.1.6 - 01/10/2014
* correcting sharing bug... again and finally.
* adding map picture to email sharing.

### v0.1.5 - 30/09/2014
* sharing through emails and sd-card bugs corrected.

### v0.1.4 - 29/09/2014
* initial market place version.
* Device position is shown, along with altitude and direction (if moving).
* Informations shown during tracking are speed, altitude, accuracy and elapsed time.
* Movements can be recorded. Informations recorded are longitude, latitude, altitude, direction, speed and accuracy.
* Tracks are recorded on device using IndexedDB.
* Stored tracks can be renamed.
* Stored tracks can be deleted.
* Position and date format can be choosen in Settings, as well as distance unit.
* Screen keep alive can be choosen in Settings.
* Stored tracks can be exported to GPX or HTML format, and saved locally or sent through email.
* Available language : English, French.

## Licence
Run, Bike, Hike... is distributed under the [MPL2.0 licence](http://www.mozilla.org/MPL/2.0/)
