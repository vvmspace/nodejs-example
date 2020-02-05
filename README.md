# Node.js skeleton example

I have no public node.js repositories for show my code examples. You can use this as node.js skeleton.

## TODO:

- check and configure mongodb with mongoose and redis

## Directories

- **config** - config as a module
- **cron** - cron tasks (see *cron/index.js*)
- **libs** - directory with libraries
- **docker** - docker-compose files + deploy scripts here
- **middlewares** - put Express middlewares (auth, error handler etc) here
- **routes** - put controllers and validators here, see routes/index.js
- **routes**/[controller] - folder contains *controller.js*, *validator.js* (not always necessary) and *index.js* files
- **routes**/[controller]/**index.js** - describes routes of controller and validation (later)

## Run

### Development

```shell script
npm run dev
```

### Production

```shell script
PORT=7070 HOST=127.0.0.1 node index.js
```

Environment variables are not required, defaults: {port: 7070, host: '127.0.0.1'} (see config/index.js -> server{})

## Containers

**MongoDB** (and **Redis**, may be later, for cache) are configured in **./docker** directory.

[**docker-compose**](https://github.com/docker/compose/releases) is required!

### Use scripts:

```shell script
npm run containers:start
npm run containers:stop
npm run containers:restart
```

**/data** directory for **MongoDB** is mapped to **/data/mongo**, please grant access for user.
