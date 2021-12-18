<h1>Sample Application Code </h1>
Download here: https://drive.google.com/open?id=1WvFpO1it79-4H6wiUa4v4jEim-bM1DuS

<h1>Node Package Manager (NPM)</h1>
Install a package globally:

```
npm install request
```

Install a package locally in the app:

```
npm install --save request
```

Fix any install warning:

```
npm audit fix
```


<h1>Introduction: libraries, structure</h1>
<ul>
<li>Templating: EJS to render variables and dynamic elements</li>
<li>Routing: Express.JS as routing engine for both REST API and Website Engine</li>
<li>Modules: NodeJS scaffolding technique as structure</li>
</ul>
<h2>1. Express.JS</h2>
So, NodeJS has many different ways to handle routing (HTTP fwd requests), computing and rendering. Express.JS is one of me most common frameworks out there for that.
We include the module and define the main app instance:

```
var express = require('express');
var app = express();
```

It is then necessary to define some parsing rules, so that POST and GET requests will be handled correctly:

```
app.use(express.static('src'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
```

We then define a routing function for the root page `"/"`:

```
app.get('/', function (req, res) {

    //code
});
```

If we want to handle POST requests and params:

```
app.post('/page1', function (req, res) {

    let key1 = req.body.key1;
});
```

<h2>2. App Structure</h2>
The main app structure is the follow
<ul>
<li><b>/src</b>: this directory contains all the css, js, and images</li>
<li><b>/modules</b>: this directory contains all the .js classes representing functional and logical components</li>
<li><b>/views</b>: this page will contain the HTML templates explained above, but ALL the files will need to have the .ejs file extention</li>
</ul>

<h3>Creating a module</h3>
We first create a new js file within the `/modules` folder. 
We can the define attributes and functions which will be accessed from the outside.

```
exports.attributeString = "";

exports.functionName = function(param1, param2){
  // code
  return anyResult;'
};
```

The `exports` prefix is necessary to define our attribute's scope.

<h3>Implementing our module</h3>
Now that we have all set, our beautiful (i.e.) <b>animals</b> module is good to go.
We include it in our `app.js` or any other script:

```
var animals = require('./modules/animals.js');
```

Easy as pie. Just like we have defined with `exports` all the methods and attributes, we recall all those properties:

```
// Equivalent of print() to the server's console
console.log(animals.attributestring);
let array = animals.functionName(param1, param2);
```

<h2>3. EJS</h2>
In order to render a dynamic webpage, we first focus on the way we are going to handle the application layer. Within a routing function:

    let data = module.getData();

    // Render
    res.render(path.join(__dirname + '/views/index.ejs'),
    {
        data: data,
    });

We now move on the html template. We assume that `data` is a dictionary which contains the key `description`. We therefore render the dynamic HTML section just like that:

```
<div>
    <p class="text-center mb-5">Last update: <%= lastUpdate %></p>
    <p class="text-center"><a href="/world-map" class="btn py-3 px-5">World map</a></p>
</div>
```

<h2>4. Promises</h2>
Promises is the new "callback". We may need to wait for a async function. We wrap any async piece of code in the following function:

```
function myDBQuery(){
  return new Promise(function(resolve, reject) {
   let result = asynchFunction();

   // Return the error
   if(result == null) 
      reject("Error encountered"); // throw equivalent

   // Return the result
   else resolve(result); // return equivalent
  }
}
```

In the script calling our async function we need to WAIT and then continue:

```
myDBQuery().then(function(resultObject){
   res.render(...); 
})
.catch(function(error){
   throw error;
});
```
