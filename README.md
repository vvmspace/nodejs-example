# Node.js skeleton example

I has no public node.js repositories. You can use this as node.js skeleton.

## Directories

- config - config as a module
- libs - directory with libraries
- routes - put controllers and validators here, see routes/index.js
- routes/[controller] - folder contains controller.js, validator.js (not required) and index.js files
- routes/[controller]/index.js - describes routes of controller and validation (later)

## Run

```shell script
PORT=7070 HOST=127.0.0.1 node index.js
```

Environment variables are not required, defaults: {port: 7070, host: '127.0.0.1'} (see config/index.js -> server{})