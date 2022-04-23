vnjikedx
========

essential tools for CLI

[![Version](https://img.shields.io/npm/v/vnjikedx.svg)](https://npmjs.org/package/vnjikedx)
[![CircleCI](https://circleci.com/gh/vanelus/vnjikedx/tree/master.svg?style=shield)](https://circleci.com/gh/vanelus/vnjikedx/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/vanelus/vnjikedx?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/vnjikedx/branch/master)
[![Codecov](https://codecov.io/gh/vanelus/vnjikedx/branch/master/graph/badge.svg)](https://codecov.io/gh/vanelus/vnjikedx)
[![Greenkeeper](https://badges.greenkeeper.io/vanelus/vnjikedx.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/vanelus/vnjikedx/badge.svg)](https://snyk.io/test/github/vanelus/vnjikedx)
[![Downloads/week](https://img.shields.io/npm/dw/vnjikedx.svg)](https://npmjs.org/package/vnjikedx)
[![License](https://img.shields.io/npm/l/vnjikedx.svg)](https://github.com/vanelus/vnjikedx/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g vnjikedx
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
vnjikedx/0.0.2 win32-x64 node-v16.16.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx vnjike:metadata:label:upsert -n <string> -v <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-vnjikemetadatalabelupsert--n-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx vnjike:metadata:label:upsert -n <string> -v <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

insert or update a custom label in scratch/sandbox orgs

```
USAGE
  $ sfdx vnjike:metadata:label:upsert -n <string> -v <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -n, --targetlabelname=targetlabelname                                             (required) custom label api name.

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetlabelvalue=targetlabelvalue                                           (required) custom label value.

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ vnjike:metadata:label:upsert --targetusername myOrg@example.com --targetlabelname "apiname" --targetlabelvalue 
  "value"
       $ vnjike:metadata:label:upsert -u myOrg@example.com -n "apiname" -v "value"
```

_See code: [lib\commands\vnjike\metadata\label\upsert.js](https://github.com/vanelus/vnjikedx/blob/v0.0.0/lib\commands\vnjike\metadata\label\upsert.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
