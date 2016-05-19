# README #

### Installations ###
* [Install WebStorm](https://www.jetbrains.com/student/)
* [Install Sourcetree](https://www.sourcetreeapp.com/)
* [Install Node.js](https://nodejs.org/en/)
* [Install MongoDB](https://www.mongodb.com/)
* [Install Git](https://git-scm.com/download/win)
* [Install WebStorm IDE Debugging Extension for Chrome](https://chrome.google.com/webstore/detail/jetbrains-ide-support/hmhgeddbohgjknpmjagkdomcpobmllji)

### Set-Up (Initialization) ###
* Connect SourceTree to the Repository at `https://bitbucket.org/sebastianober/sebaprojekt`
* create folders `C:\data\db\` and `C:\data\log\`
* Open WebStorm, load our project
* At bottom left of the screen, click on symbol, open Terminal
* Run `npm install mongoose --save-dev`
* Download plugin Mongo (from repository), restart WebStorm
* Settings, Other Settings, Mongo Servers
* In top box, enter path `C:\Program Files\MongoDB\Server\3.2\bin\mongo.exe`
* Click on "+" for new connection, label "jetbrains", user database "jetbrains", test connection, ok
* Run `npm install express --save-dev`
* Run `npm install -g bower`
* Run `cd public`
* Run `bower install angular`
* `npm install cors --save-dev`
* `npm install body-parser --save-dev`

### Every time ###
* Run `C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe`

## Video Tutorials ##
* [Set-Up](https://www.youtube.com/watch?v=JnMvok0Yks8)
* [TheNewBoston](https://www.youtube.com/watch?v=-u-j7uqU7sI&list=PL6gx4Cwl9DGBMdkKFn3HasZnnAqVjzHn_)
* [Einführung in Express](https://www.youtube.com/watch?v=FqMIyTH9wSg&index=5&list=PLoYCgNOIyGAApoDfJHjmMgGNlYenKg5jO)
* [MongoDB Connection](https://www.youtube.com/watch?v=5e1NEdfs4is&list=PLoYCgNOIyGAApoDfJHjmMgGNlYenKg5jO&index=5#t=189.394242)
* [MongoDB Complete with get&post](https://www.youtube.com/watch?v=Do_Hsb_Hs3c)


## Useful links ##
* [SLACK](https://sebaprojekt.slack.com/messages/general/)
* [MEAN Stack](http://mean.io/#!/)

## Stuff ##
* [Markdown Syntax](https://bitbucket.org/tutorials/markdowndemo)

## Database backup and sharing ##
* [Source](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/)
* Run Mongodb Server
* Run `mongodump.exe --out {{folder}}`
* To restore: `mongorestore.exe {{path to backup}}`
* Human readable: `mongoexport.exe --type={{csv|json}} --out {{folder}}`