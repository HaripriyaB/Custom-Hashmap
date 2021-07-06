const Entry = require("./models/Entry");
const RbTree = require("functional-red-black-tree");
const createRBTree = require("functional-red-black-tree");

var table = [];
var mapcapacity = 16;
var size=0;

function showTable(){
    return table;
}

function hash(key){
    let ind=0;
    for(let i=0;i<key.length;i++){
        ind +=key.charCodeAt(i);
    }
    ind = ind%mapcapacity;
    return ind;
}

function rehash(){
    if(size == mapcapacity*8){
        mapcapacity = 2*mapcapacity;
        let temp = table;
        table = [];
        size=0;
        temp.forEach(node=>{
                while(node!=null){
                    insertion(node.key,node.value);
                    node=node.next;
                }
        });
    }
}

async function insertion(key,value){
    rehash();
    let index = hash(key);
    // var newnode = new Entry(key,value,null);
    
    if(table[index] == null){
        var rbTree = createRBTree();
        table[index] = rbTree.insert(key,value);
        size++;
    } else {
        let currentTree = table[index];
        if(currentTree.get(key) == null){
            currentTree = currentTree.insert(key,value);
            size++;
        } else{
            currentTree = currentTree.remove(key);
            currentTree = currentTree.insert(key,value);
            table[index] = currentTree;
            return `${key} was already present, Value updated!`;
        }
        table[index] = currentTree;
    }
    // if(table[index] == null){
    //     table[index] = newnode;
    //     size++;
    // } else {
    //     let previousNode = null;
    //     let currentNode = table[index];
    //     while(currentNode!=null){
    //         if(currentNode.key == key){
    //             currentNode.value = value;
    //             return `${key} was already present, Value updated!`;
    //         }
    //         previousNode = currentNode;
    //         currentNode = currentNode.next;
    //     }
    //     if(previousNode != null && currentNode == null){
    //         size++;
    //         previousNode.next = newnode;
    //     }
    // }
    // console.log(`${index}  ${size}`);
    return `${key} - ${value} inserted successfully`; 
}

async function getvalueofkey(key){
    const index = hash(key);
    let listHead = table[index];
    if(listHead !=null){
        return listHead.get(key);

        // while(listHead!=null){
        //     if(listHead.key == key){
        //         return listHead.value;
        //     } 
        //     listHead = listHead.next;
        // }
    }
    return null;
}

async function deletekeyvaluepair(key){
    const index = hash(key);
    let previousNode = null;
    let listHead = table[index];
    if(listHead!=null){
        if(listHead.get(key)!=null){
        table[index]=listHead.remove(key);
        return true;
        }
        // while(listHead!=null){
        //     if(listHead.key == key){
        //         if(previousNode == null){
        //             listHead = listHead.next;
        //             table[index] = listHead;
        //             return true;
        //         } else{
        //             previousNode.next = listHead.next;
        //             return true;
        //         }
        //     }
        //     previousNode = listHead;
        //     listHead = listHead.next;
        // }
    }
    return false;
}

module.exports = {
    showTable,
    hash,
    insertion,
    deletekeyvaluepair,
    getvalueofkey
}