/**
 * BinaryTreeNode
 */
class BinaryTreeNode {

  /**
   * BinaryTreeNode
   * @param {*} value 
   */
  constructor(value = null) {
    this._value = value;
    this._parent = null;
    this._left = null;
    this._right = null;
  }
}

/** 
 * 完全二叉树数组形式转换成 BinaryTree 并返回 root 节点
 * @param {number[]} array 
 * @return {BinaryTreeNode}
 */
function _arrayToTree(array) {
  if (!array.length || !array[0]) {
    return null;
  }
  const isNull = (value) => {
    return value === null || value === undefined;
  }
  let root = new BinaryTreeNode(array.shift());
  let q = [root];
  while (array.length) {
    let node = q.shift();
    let left = array.shift();
    let right = array.shift();
    if (!node && !(isNull(left) && isNull(right))) {
      throw new Error("invalid array");
    }
    if (!isNull(left)) {
      _setLeft(node, new BinaryTreeNode(left));
      q.push(node._left);
    } else {
      q.push(null);
    }
    if (!isNull(right)) {
      _setRight(node, new BinaryTreeNode(right));
      q.push(node._right);
    } else {
      q.push(null);
    }
  }
  return root;
}

/**
 * check
 * @param {*} value 
 */
function _assetNotNull(value) {
  if (!value) {
    throw new ReferenceError("argument cannot be null");
  }
}

/**
 * 替换节点
 * @param {BinaryTreeNode} node 
 * @param {BinaryTreeNode} newNode 
 */
function _replace(node, newNode) {
  let parent = node._parent;
  if (parent) {
    if (parent._left === node) {
      _setLeft(parent, newNode);
    } else {
      _setRight(parent, newNode);
    }
  } else {
    newNode._parent = null;
  }
  return newNode;
}

/**
 * 移除节点
 * @param {BinaryTreeNode} node 
 */
function _remove(node) {
  _replace(node, null);
}

/**
 * 设置左子树
 * @param {BinaryTreeNode} node 
 * @param {BinaryTreeNode} left 
 */
function _setLeft(node, left) {
  if (node._left === left) {
    return;
  }
  node._left && (node._left._parent = null);
  node._left = left;
  node._left && (node._left._parent = node);
}

/**
 * 设置右子树
 * @param {BinaryTreeNode} node 
 * @param {BinaryTreeNode} right 
 */
function _setRight(node, right) {
  if (node._right === right) {
    return;
  }
  node._right && (node._right._parent = null);
  node._right = right;
  node._right && (node._right._parent = node);
}

/**
 * 获取叔父节点
 * @param {BinaryTreeNode} node 
 * @return {BinaryTreeNode}
 */
function _getUncle(node) {
  let parent = node._parent;
  if (parent && parent._parent) {
    let grandParent = parent._parent;
    return grandParent.left === parent ? grandParent._right : grandParent._left;
  }
  return null;
}

/**
 * 左子树大小
 * @param {BinaryTreeNode} node 
 */
function _leftSize(node) {
  return _size(node._left);
}

/**
 * 右子树大小
 * @param {BinaryTreeNode} node 
 */
function _rightSize(node) {
  return _size(node._right);
}

/**
 * 左子树高度
 * @param {BinaryTreeNode} node 
 */
function _leftHeight(node) {
  return _height(node._left);
}

/**
 * 右子树高度
 * @param {BinaryTreeNode} node 
 */
function _rightHeight(node) {
  return _height(node._right);
}

/**
 * 树大小
 * @param {BinaryTreeNode} node 
 */
function _size(node) {
  if (!node) return 0;
  return _leftSize(node) + _rightSize(node) + 1;
}

/**
 * 树高度
 * @param {BinaryTreeNode} node 
 */
function _height(node) {
  if (!node) {
    return 0;
  }
  return Math.max(_leftHeight(node), _rightHeight(node)) + 1;
}

/**
 * 中序遍历
 * @param {BinaryTreeNode} node 
 */
function _inOrderTraverse(node) {
  let traverse = [];
  if (!node) {
    return traverse;
  }
  traverse = traverse.concat(_inOrderTraverse(node._left));
  traverse.push(node._value);
  traverse = traverse.concat(_inOrderTraverse(node._right));
  return traverse;
}

/**
 * 将二叉树输出为可打印格式的数组
 * @param {BinaryTreeNode} node 
 */
function _print(node) {
  const fill = (rows, node, r, s, e) => {
    if (!node) return;
    let i = ~~((s + e) / 2);
    rows[r][i] = '' + node._value;
    fill(rows, node._left, r + 1, s, i - 1);
    fill(rows, node._right, r + 1, i + 1, e);
  }
  let h = _height(node);
  let l = Math.pow(2, h - 1) * 2 - 1;
  let rows = Array.from({
    length: h
  }, () => new Array(l).fill(''));
  fill(rows, node, 0, 0, l - 1);
  return rows;
}

/**
 * 节点右旋
 * @param {BinaryTreeNode} node 
 */
function _rotateRight(node) {
  let nodeLeft = node._left;
  let nodeLeftRight = node._left._right;
  _setLeft(node, null);
  _replace(node, nodeLeft);
  _setRight(nodeLeft, node);
  _setLeft(node, nodeLeftRight);
  return nodeLeft;
}

/**
 * 节点左旋
 * @param {BinaryTreeNode} node 
 */
function _rotateLeft(node) {
  let nodeRight = node._right;
  let nodeRightLeft = node._right._left;
  _setRight(node, null);
  _replace(node, nodeRight);
  _setLeft(nodeRight, node);
  _setRight(node, nodeRightLeft);
  return nodeRight;
}

/**
 * validate if a node has BinaryTree structure
 * @param {BinaryTreeNode} root 
 */
function _validate(root) {
  let q = [root];
  let set = new Set();
  while (q.length) {
    let node = q.shift();
    if (set.has(node)) {
      return false;
    }
    set.add(node);
    if (node._left) {
      if (node._left._parent !== node) {
        return false;
      }
      q.push(node._left);
    }
    if (node._right) {
      if (node._right._parent !== node) {
        return false;
      }
      q.push(node._right);
    }
  }
  return true;
}

// Export
module.exports = {
  _arrayToTree,
  _setLeft,
  _setRight,
  _replace,
  _remove,
  _getUncle,
  _size,
  _height,
  _leftHeight,
  _leftSize,
  _rightHeight,
  _rightSize,
  _rotateLeft,
  _rotateRight,
  _inOrderTraverse,
  _print,
  _validate
}