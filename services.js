const Entry = require("./models/Entry");
const createRBTree = require("functional-red-black-tree");

var table = [];
var cache = [];
var mapcapacity = 16;
var size = 0;
var rehashCount = 0;

function showTable() {
  return cache;
}

function hash(key) {
  let ind = 0;
  for (let i = 0; i < key.length; i++) {
    ind += key.charCodeAt(i);
  }
  ind = ind % mapcapacity;
  return ind;
}

function rehash() {
    rehashCount++;
    mapcapacity = 2 * mapcapacity;
    let temp = table;
    table = [];
    size = 0;
    temp.forEach((node) => {
      const keys = node.keys;
      const values = node.values;
      for (let i = 0; i < keys.length; i++) {
        insertion(keys[i], values[i]);
      }
      // while(node!=null){
      //     insertion(node.key,node.value);
      //     node=node.next;
      // }
    });
    cache = table;
    rehashCount--;
}

function sleep(s) {
  return new Promise((resolve) => {
    setTimeout(resolve, s);
  });
}   

async function insertion(key, value) {
    if (size == mapcapacity * 8) {
        if(rehashCount==0) {
            rehash();
        } else{
            // delay the request
            await sleep(5000);
        }
    }
  let index = hash(key);
  // var newnode = new Entry(key,value,null);

  if (cache[index] == null) {
    var rbTree = createRBTree();
    cache[index] = rbTree.insert(key, value);
    table[index] = rbTree.insert(key, value);
    size++;
  } else {
    let currentTree = cache[index];
    if (currentTree.get(key) == null) {
      currentTree = currentTree.insert(key, value);
      size++;
    } else {
      var iter = currentTree.find(key);
      currentTree = iter.update(value);
      cache[index] = currentTree;
      table[index] = currentTree;
      return `${key} was already present, Value updated!`;
    }
    cache[index] = currentTree;
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
  console.log(`${index}  ${size}`);
  return `${key} - ${value} inserted successfully`;
}

function getvalueofkey(key) {
  const index = hash(key);
  let listHead = cache[index];
  if (listHead) {
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

function deletekeyvaluepair(key) {
  const index = hash(key);
  let previousNode = null;
  let listHead = cache[index];
  if (listHead) {
    if (listHead.get(key)) {
      cache[index] = listHead.remove(key);
      table[index] = listHead.remove(key);
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
  getvalueofkey,
};
