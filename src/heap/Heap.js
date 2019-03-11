const Comparator = require("../common/Comparator");
/**
 * Heap
 */
class Heap {
  /**
   * 构造
   * @param {Function} fn comparator function
   */
  constructor(fn = null) {
    this.comparator = new Comparator(fn);
  }
}

module.exports = Heap;