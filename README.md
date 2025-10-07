# vnjikedx

Essential tools for Salesforce CLI v2

[![Version](https://img.shields.io/npm/v/vnjikedx.svg)](https://npmjs.org/package/vnjikedx)
[![Downloads/week](https://img.shields.io/npm/dw/vnjikedx.svg)](https://npmjs.org/package/vnjikedx)
[![License](https://img.shields.io/npm/l/vnjikedx.svg)](https://github.com/vanelus/vnjikedx/blob/master/package.json)

<!-- toc -->
* [vnjikedx](#vnjikedx)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g vnjikedx
$ sf COMMAND
running command...
$ sf (--version)
vnjikedx/1.0.0 win32-x64 node-v20.18.0
$ sf --help [COMMAND]
USAGE
  $ sf COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`sf vnjike data backup`](#sf-vnjike-data-backup)
* [`sf vnjike metadata label upsert`](#sf-vnjike-metadata-label-upsert)

## `sf vnjike data backup`

export all data from production orgs

```
USAGE
  $ sf vnjike data backup -o <value> -d <value> [--json] [--flags-dir <value>]

FLAGS
  -d, --target-directory=<value>  (required) target directory where data files are exported
  -o, --target-org=<value>        (required) Username or alias of the target org. Not required if the `target-org`
                                  configuration variable is already set.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  export all data from production orgs

EXAMPLES
  $ sf vnjike data backup --target-org myOrg@example.com --target-directory "$HOME"
```

_See code: [src/commands/vnjike/data/backup.ts](https://github.com/vanelus/vnjikedx/blob/v1.0.0/src/commands/vnjike/data/backup.ts)_

## `sf vnjike metadata label upsert`

insert or update custom labels in scratch/sandbox orgs

```
USAGE
  $ sf vnjike metadata label upsert -o <value> -n <value> -v <value> [--json] [--flags-dir <value>]

FLAGS
  -n, --target-label-name=<value>   (required) custom label api name(s). Comma-separated for multiple labels.
  -o, --target-org=<value>          (required) Username or alias of the target org. Not required if the `target-org`
                                    configuration variable is already set.
  -v, --target-label-value=<value>  (required) custom label value(s). Use 'label1:value1,label2:value2' format for
                                    multiple labels.

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  insert or update custom labels in scratch/sandbox orgs

EXAMPLES
  $ sf vnjike metadata label upsert --target-org myOrg@example.com --target-label-name "apiname" --target-label-value "value"

  $ sf vnjike metadata label upsert -o myOrg@example.com -n "apiname" -v "value"

FLAG DESCRIPTIONS
  -n, --target-label-name=<value>  custom label api name(s). Comma-separated for multiple labels.

  -v, --target-label-value=<value>

    custom label value(s). Use 'label1:value1,label2:value2' format for multiple labels.
```

_See code: [src/commands/vnjike/metadata/label/upsert.ts](https://github.com/vanelus/vnjikedx/blob/v1.0.0/src/commands/vnjike/metadata/label/upsert.ts)_
<!-- commandsstop -->

## Installation

```bash
sf plugins install vnjikedx
```

## Development

This plugin has been modernized for SF CLI v2 with the following major changes:

### Key Changes Made:

1. **Updated Dependencies**: 
   - Upgraded from `@salesforce/command` to `@salesforce/sf-plugins-core`
   - Updated `@oclif/core` to version 3+
   - Updated `@salesforce/core` to version 6+

2. **Command Structure**:
   - Changed from `SfdxCommand` to `SfCommand`
   - Updated flag definitions to use modern SF CLI patterns
   - Changed from `--targetusername` to `--target-org`
   - Updated command examples to use `sf` instead of `sfdx`

3. **TypeScript Modernization**:
   - Added proper TypeScript types for all parameters
   - Improved error handling with typed catch blocks
   - Updated import statements for better module compatibility

4. **CLI Integration**:
   - Updated `package.json` to target SF CLI v2
   - Changed binary from `sfdx` to `sf`
   - Updated topic structure for better command organization

### Commands Available:

- `sf vnjike data backup`: Export all data from production orgs
- `sf vnjike metadata label upsert`: Insert or update custom labels in orgs

The plugin maintains full backward functionality while being compatible with the modern SF CLI v2 architecture.

## Acknowledgments

This plugin was inspired by the excellent work done in [sf-automatic-data-export-script](https://github.com/enreeco/sf-automatic-data-export-script) by @enreeco. The core data export functionality builds upon the concepts and techniques demonstrated in that repository.
