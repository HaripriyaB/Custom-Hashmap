/*
NOTE: The commented codes are of Linkedlist implementation
Current code contains Red-Black tree implementation.
*/

const express = require('express');
const bodyparser = require("body-parser");
const RbTree = require("functional-red-black-tree")

const app = express();

//initialise middlewares
const middlewares = require("./middlewares");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// @type    -   GET
// @route   -   /
// @desc    -   Display the custom hashmap
// @access  -   PUBLIC
app.get("/",(req,res)=>{
    const table = middlewares.showTable();
    let jsonObj = [];
    table.forEach(tree=>{
        // console.log(tree.keys);
        // console.log(tree.values);
        const keys = tree.keys;
        const values = tree.values;
        for(let i=0;i<keys.length;i++){
            const obj={
                key: keys[i],
                value: values[i]
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
    return res.json({table:jsonObj});
});

//Function to handle post and put requests
function updateorcreate(req,res){
    const key = req.body.key;
    const value = req.body.value;
    middlewares.insertion(key,value)
    .then(result=>{
        return res.status(201).json({success:result});
    })
    .catch(err=>console.log(err));
}

// @type    -   POST
// @route   -   /add
// @desc    -   insertion of a key value pair, if already present then update
// @access  -   PUBLIC
app.post("/add",updateorcreate);

// @type    -   PUT
// @route   -   /add
// @desc    -   Updation of a key value pair
// @access  -   PUBLIC
app.put("/add",updateorcreate);

// @type    -   GET
// @route   -   /get
// @desc    -   read the value of a key
// @access  -   PUBLIC
app.get("/get",(req,res)=>{
    const key = req.body.key;
    middlewares.getvalueofkey(key)
    .then(result=>{
        if(result!=null){
            return res.json({success:`Key: ${key}, Value: ${result}`});
        } else{
            return res.status(404).json({error:"Key not found!"});
        }
    })
    .catch(err=>console.log(err));
});

// @type    -   DELETE
// @route   -   /delete
// @desc    -   delete a key node
// @access  -   PUBLIC
app.delete("/delete",(req,res)=>{
    const key = req.body.key;
    middlewares.deletekeyvaluepair(key)
    .then(result=>{
        if(result==true){
            return res.json({success:`${key} deleted successfully`});
        } else{
            return res.status(404).json({error:"Key not found!"});
        }
    })
    .catch(err=>console.log(err));
});

const port = process.env.port || 5000;

app.listen(port,()=> console.log(`Server running at ${port}`));