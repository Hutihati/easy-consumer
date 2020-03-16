// debugging console
/* let wappstoConsole = require("wapp-api/console");
wappstoConsole.start(); */

// wapp api connection
/* let Wappsto = require("wapp-api"); */
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const Annotation = require("./models/annotation");

// innitialize
/* let wappsto = new Wappsto(); */
const app = express();

// test data
let testseries = require("./data/series");
let anno = new Annotation("Annotation name", true, "generic datasource", true);

// variables
const now = Date.now();

function adjustData(from, to) {
  for (let i = 0; i < testseries.length; i++) {
    const series = testseries[i];
    offset = 0;

    for (let j = 0; j < series.datapoints.length; j++) {
      series.datapoints[j][1] = Math.round(now - offset);

      offset += (to - from) / series.datapoints.length;
    }
  }
}

app.use(bodyParser.json());

/* wappsto.get(
  "network",
  {},
  {
    quantity: "all",
    expand: 1,
    success: (collection, response, XHRResponse) => {
      // your code here
    },
    error: (collection, XHRResponse) => {
      // something went wrong
    },
    onStatusChange: status => {
      // if you want to track it to show something to the user
      if (status) {
        console.log("Status: " + status);
      }
    }
  }
); */

function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");
}

app.all("/", (req, res) => {
  setCORSHeaders(res);
  res.status(200).send("Backend is up and running.");
  res.end();
});

app.all("/search", (req, res) => {
  setCORSHeaders(res);
  let result = [];
  _.forEach(testseries, (ts) => {
    result.push(ts.target);
  });

  res.json(result);
  res.end();
});

app.all("/annotations", function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  // testdata
  var annotations = [
    {
      annotation: anno,
      time: now - 240000,
      title: "Shit crashed 3: The fast and the furious",
      tags: "crash",
      text: "Crash report 3, long text that just keeps on going."
    },
    {
      annotation: anno,
      time: now - 120000,
      title: "Shit crashed 2: Electric boogaloo",
      tags: "crash",
      text: "Crash report 2"
    },
    {
      annotation: anno,
      time: now - 60000,
      title: "Shit crashed",
      tags: "crash",
      text: "Crash report 1"
    }
  ];

  res.json(annotations);
  res.end();
});

// doesn't support adhog filters or tables
app.all("/query", (req, res) => {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  let tsResult = [];

  // sets valid timestamps for dummy json data
  adjustData(
    Date.parse(req.body.range["from"]),
    Date.parse(req.body.range["to"])
  );

  _.each(req.body.targets, target => {
    let k = _.filter(testseries, t => {
      console.log("t.target: " + t.target + " target.target: " + target.target + "\n");
      console.log(t.target === target.target);
      return t.target === target.target;
    });
    _.each(k, kk => {
      tsResult.push(kk);
    });
  });

  res.json(tsResult);
  res.end();
});

app.listen(4444);

console.log("Server is listening to port 4444");
