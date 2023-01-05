# Next.js Teslo Shop App

To run local, you need the database
```
docker-compose up -d
```

* -d, mean __detached__

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```
* Rebuild node modules and start next
```
yarn install
yarn dev
```

## Configure environment variables
Rename file __.env.template__ to __.env__

## fill the database with test information
```
  http://localhost:3000/api/seed
```