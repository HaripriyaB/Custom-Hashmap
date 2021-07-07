/*
NOTE: The commented codes are of Linkedlist implementation
Current code contains Red-Black tree implementation.
*/

const express = require("express");
const bodyparser = require("body-parser");

const app = express();

//initialise services
const services = require("./services");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// @type    -   GET
// @route   -   /map/display
// @desc    -   Display the custom hashmap
// @access  -   PUBLIC
app.get("/map/display", (req, res) => {
  const table = services.showTable();
  let jsonObj = [];
  table.forEach((tree) => {
    // console.log(tree.keys);
    // console.log(tree.values);
    const keys = tree.keys;
    const values = tree.values;
    for (let i = 0; i < keys.length; i++) {
      const obj = {
        key: keys[i],
        value: values[i],
      };
      jsonObj.push(obj);
    }
  });

  // table.forEach(element => {
  //     const obj = {
  //         key: element.key,
  //         value: element.value
  //     };
  //     if(element.next !=null){
  //         while(element!=null){
  //             const obj = {
  //                 key: element.key,
  //                 value: element.value
  //             };
  //             jsonObj.push(obj);
  //             element = element.next;
  //         }
  //     }
  //     else {
  //         jsonObj.push(obj);
  //     }
  // });
  return res.json({ table: jsonObj });
});

//Function to handle post and put requests
async function updateorcreate(req, res) {
  const key = req.body.key;
  const value = req.body.value;
  let result = await services.insertion(key, value);
  return res.status(201).json({ success: result });
}

// @type    -   POST
// @route   -   /map
// @desc    -   insertion of a key value pair, if already present then update
// @access  -   PUBLIC
app.post("/map", (req, res) => {
  updateorcreate(req, res).catch((err) => console.log(`Error: ${err}`));
});

// @type    -   PUT
// @route   -   /map
// @desc    -   Updation of a key value pair
// @access  -   PUBLIC
app.put("/map", (req, res) => {
  updateorcreate(req, res).catch((err) => console.log(`Error: ${err}`));
});

// @type    -   GET
// @route   -   /map/:key
// @desc    -   read the value of a key
// @access  -   PUBLIC
app.get("/map/:key", async (req, res) => {
  try {
    const key = req.params.key;
    let result = await services.getvalueofkey(key);
    if (!result) {
      return res.status(404).json({ error: "Key not found!" });
    } else {
      return res.json({ success: `Key: ${key}, Value: ${result}` });
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

// @type    -   DELETE
// @route   -   /map/:key
// @desc    -   delete a key node
// @access  -   PUBLIC
app.delete("/map/:key", async (req, res) => {
  try {
    const key = req.params.key;
    let result = await services.deletekeyvaluepair(key);
    if (result == true) {
      return res.json({ success: `${key} deleted successfully` });
    } else {
      return res.status(404).json({ error: "Key not found!" });
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running at ${port}`));
