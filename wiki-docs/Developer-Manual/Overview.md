We examine the project structure:

| File/folder | Description |
|:----------|:------|
|**node_modules/**|Locally saved NodeJS libraries 	
|**models/**|Data models definition directory, including db interface
|**src/**|Assets directory: less, css, js, images
|**modules/**|Data models implementation directory
|**views/**|UI Templates directory
|**routes/**|Routing modules directory
|**app.js**|Project Init, defining routes, http ports, libraries
|**package-lock.json**|Support Node Project file
|**package.json**|Node project file with details, dependencies, scripts
|**Procfile**|Heroku config file
|**.gitignore**|git config file to avoid adding non relevant folders/files to the repo

## Handling routing

We rely on the REST paradigm to process data between users and the server.

<img width="500px" src="https://www.astera.com/wp-content/uploads/2020/01/rest.png" />

We focus on the **routes/** folder containing the following routers:
- [ajax.js](ajax.js)
- [api.js](api.js)
- [delete.js](delete.js)
- [index.js](index.js)
- [managerRoutes.js](managerRoutes.js)
- [pay.js](pay.js)
- [paymentRoutes.js](paymentRoutes.js)
- [userRoutes.js](userRoutes.js)

