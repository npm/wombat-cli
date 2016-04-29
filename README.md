# wombat-cli

[![Build Status](https://travis-ci.com/npm/wombat-cli.svg?token=DqHFWFDrBinQd9xV4xvQ&branch=master)](https://travis-ci.com/npm/wombat-cli) [![Coverage Status](https://coveralls.io/repos/github/npm/wombat-cli/badge.svg?branch=master&t=5zRfPy)](https://coveralls.io/github/npm/wombat-cli?branch=master)

The wombat cli tool.



                 ,.--""""--.._
               ."     .'      `-.
              ;      ;           ;
             '      ;             )
            /     '             . ;
           /     ;     `.        `;
         ,.'     :         .     : )
         ;|\'    :      `./|) \  ;/
         ;| \"  -,-   "-./ |;  ).;
         /\/              \/   );
        :                 \    ;
        :     _      _     ;   )
        `.   \;\    /;/    ;  /
          !    :   :     ,/  ;
           (`. : _ : ,/""   ;
            \\\`"^" ` :    ;
                     (    )
                     ////

```
the helpful wombat tool

Commands:
  hook               control your hooks
  package <package>  see information about the named package
  whoami             the username you are authenticated as

Options:
  --registry  the registry configuration to use             [default: "default"]
  --help      Show help                                                [boolean]
  --version   show version information                                 [boolean]
```

Help is available for each of the supported commands.

You may also do fun things like `wombat ls --depth=0` and `npm` will be invoked.

## configuration

Wombat reads its config from the file `~/.wombatrc`. This file is parsed as [TOML](https://github.com/toml-lang/toml). The defaults look like this:

```toml
[default]
registry = "https://registry.npmjs.org"
api = "https://api.npmjs.org"
```

You can add sections for other registries to talk to and point wombat to them using the name of the config section, or change the default to a registry you use more often. For example:

```toml
[default]
registry = "https://registry.npmjs.org"
api = "https://api.npmjs.org"

[enterprise]
registry = "https://npm-enterprise.private.npmjs.com"
api = "https://api.private.npmjs.com"
```

Then run something like `wombat -r enterprise view @secret/private-package`

## web hooks

```
/usr/local/bin/wombat hook

Commands:
  ls [pkg]                    list your hooks
  add <pkg> <url> <secret>    add a hook to the named package
  update <id> <url> [secret]  update an existing hook
  rm <id>                     remove a hook
  test <id>                   test a hook

Examples:
  /usr/local/bin/wombat hook add lodash
  https://example.com/ my-shared-secret
  /usr/local/bin/wombat hook ls lodash
  /usr/local/bin/wombat hook rm id-ers83f
```

## viewing packages

## license

ISC probably eventually. For the moment unreleased.
