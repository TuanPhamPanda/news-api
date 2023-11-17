Name project: News-RestfulAPI
Technical: 
    + ORM Sequelize + MySQL
    + NodeJS + Typescript + ExpressJS + RestfulAPI
    + JWT: Authorization & Authentication 
    + Socket
    + Image save on cloudinary, using multer connect to cloudinary
    + joi validate data
Version API: 1.0
Script running:
    + build: "tsc"
    + start: "npm run build && babel-node ./dist/index.js"
    + dev: "nodemon --exec ts-node index.ts"
    + prod: "NODE_ENV=production node ./dist/index.js"