const INPUT_COUNT = 1e8;
const INPUT_MAX = 1e6;
const TEST_COUNT = 5;

function time() {
  return process.hrtime();
};

function performance(start, end) {
  return ~~(((end[0] * 1e9 + end[1]) - (start[0] * 1e9 + start[1])) / 1e6)
}

function Random(max) {
  return ~~(Math.random() * max); 
}

function Random10() {
  return ~~(Math.random() * 10);
}

function randomArray(count, inputmax) {
  let array = [];
  while (count) {
    array.push(Random(inputmax));
    count--;
  }
  return array;
}

function randomOp(count) {
  let ops = [];
  while (count) {
    let op = Random10();
    if (op < 1) { // DELETE [0]
      ops.push(1);
    } else if (op < 7) { // SEARCH [1,2,3,4,5,6]
      ops.push(2);
    } else {
      ops.push(3); // INSERT [7,8,9]
    }
    count--;
  }
  return ops;
}

function BenchmarkTest(trees, testcount, inputcount, inputmax) {
  let results = {};
  trees.forEach((tree, index) => {
    tree.desc = tree.desc || index;
    results[tree.desc] = {
      MIX_SUM: 0,
    }
  });
  const input = randomArray(inputcount, inputmax);
  while (testcount) {
    const ops = randomOp(inputcount);
    for (let n = 0; n < trees.length; n++) {
      const {
        Tree,
        desc
      } = trees[n];
      let result = results[desc];
      tree = new Tree()
      // BEGIN: MIX
      let {
        cost,
        height,
        size
      } = testOnce(input, ops, Tree)
      result[testcount] = cost + "(" + height + "," + size + ")";
      // result[count] = cost;
      result.MIX_SUM += cost;
      // END: MIX
    }
    testcount--;
  }
  return results;
}


function testOnce(input, ops, Tree) {
  tree = new Tree()
  // BEGIN: MIX
  start = time();
  for (let j = 0; j < INPUT_COUNT; j++) {
    let op = ops[j];
    let value = input[j];
    if (op === 1) {
      tree.delete(value);
    } else if (op === 2) {
      tree.search(value);
    } else {
      tree.insert(value);
    }
  }
  end = time();
  cost = performance(start, end);
  return {
    cost,
    height: tree.height,
    size: tree.size
  }
}

/**
 * Benckmark SetFakeTree
 */
class SetFakeTree {
  constructor() {
    this.set = new Set();
  }

  insert(value) {
    this.set.add(value)
  }

  delete(value) {
    this.set.delete(value)
  }

  search(value) {
    return this.set.has(value)
  }

  get height() {
    return 0;
  }

  get size() {
    return this.set.size;
  }
}

// TEST: 
let AVLTree = require("../../src/tree/AVLTree");
let BinarySearchTree = require("../../src/tree/BinarySearchTree");
let result = BenchmarkTest([{
  Tree: SetFakeTree,
  desc: "Set"
}, {
  Tree: AVLTree,
  desc: 'AVLTree'
}, {
  Tree: BinarySearchTree,
  desc: 'BinarySearchTree'
}], TEST_COUNT, INPUT_COUNT, INPUT_MAX)
console.table(result)