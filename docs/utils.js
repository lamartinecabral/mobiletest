var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BST = /** @class */ (function () {
    function BST(comparator) {
        this.tree = [null];
        this.freeIndexes = [];
        if (comparator)
            this.comp = comparator;
        else
            this.comp = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); };
    }
    BST.prototype.newPointer = function () {
        if (this.freeIndexes.length)
            return this.freeIndexes.pop();
        this.tree.push(undefined);
        return this.tree.length - 1;
    };
    BST.prototype.free = function (node) {
        this.freeIndexes.push(node);
        delete this.tree[node];
    };
    /**
     * returns the quantity of node in the tree
     * O(1)
    */
    BST.prototype.size = function () { return !(this.root) ? 0 : this.tree[this.root].s; };
    /**
     * returns an object with key and value of the node from the given reference
     * O(1)
    */
    BST.prototype.get = function (pointer) { if(!pointer || !this.tree[pointer]) return undefined; return { key: this.tree[pointer].k, value: this.tree[pointer].v }; };
    /**
     * returns a reference for the node with the given key
     * O(log)
    */
    BST.prototype.find = function (key) {
        if (key === undefined || key === null)
            return undefined;
        var node = this.root;
        while (node && this.comp(this.tree[node].k, key) != 0) {
            if (this.comp(this.tree[node].k, key) > 0)
                node = this.tree[node].l;
            else
                node = this.tree[node].r;
        }
        return node;
    };
    BST.prototype.smaller = function (node) {
        if (!node || !this.tree[node])
            return undefined;
        while (this.tree[node].l)
            node = this.tree[node].l;
        return node;
    };
    BST.prototype.greater = function (node) {
        if (!node || !this.tree[node])
            return undefined;
        while (this.tree[node].r)
            node = this.tree[node].r;
        return node;
    };
    /**
     * return reference for the next node in a in order traversal of the tree
     * O(1) amortized
    */
    BST.prototype.next = function (node) {
        if (this.tree[node].r)
            return this.smaller(this.tree[node].r);
        while (this.tree[node].p && node == this.tree[this.tree[node].p].r)
            node = this.tree[node].p;
        if (this.tree[node].p)
            return this.tree[node].p;
        return undefined;
    };
    /**
     * return reference for the previous node in a in order traversal of the tree
     * O(1) amortized
    */
    BST.prototype.prev = function (node) {
        if (this.tree[node].l)
            return this.greater(this.tree[node].l);
        while (this.tree[node].p && node == this.tree[this.tree[node].p].l)
            node = this.tree[node].p;
        if (this.tree[node].p)
            return this.tree[node].p;
        return undefined;
    };
    /**
     * returns a reference for the node with the kth smaller key
     * O(log)
    */
    BST.prototype.kth = function (i) {
        if (isNaN(i))
            return i;
        i = +i;
        var node = this.root;
        while (node) {
            if (i > this.tree[node].s)
                return undefined;
            var esq = (!this.tree[node].l ? 1 : this.tree[this.tree[node].l].s + 1);
            if (i === esq)
                return node;
            if (i > esq) {
                i -= esq;
                node = this.tree[node].r;
            }
            else {
                node = this.tree[node].l;
            }
        }
        return console.error("nao devia chegar aqui");
    };
    /**
     * returns how many nodes has key smaller than or equal to the given key
     * O(log)
    */
    BST.prototype.order = function (key) {
        if (key === undefined || key === null)
            return undefined;
        var node = this.root;
        var i = 0;
        while (node) {
            var esq = 1 + (this.tree[node].l ? this.tree[this.tree[node].l].s : 0);
            if (this.comp(key, this.tree[node].k) == 0) {
                return i + esq;
            }
            else if (this.comp(key, this.tree[node].k) > 0) {
                i += esq;
                node = this.tree[node].r;
            }
            else {
                node = this.tree[node].l;
            }
        }
        return i;
    };
    /**
     * in order traversal the tree calling the given function for every node, passing two parameters: the key and the value of the node
     * O(n)
    */
    BST.prototype.inOrder = function (callback) {
        var s = [];
        if (this.root)
            s.push(this.root);
        while (s.length) {
            var top_1 = s.pop();
            if (top_1 < 0) {
                callback(this.tree[-top_1].k, this.tree[-top_1].v);
            }
            else {
                if (this.tree[top_1].r)
                    s.push(this.tree[top_1].r);
                s.push(-top_1);
                if (this.tree[top_1].l)
                    s.push(this.tree[top_1].l);
            }
        }
    };
    /**
     * returns an array with all the nodes with details about the structure of the tree
    */
    BST.prototype.prettify = function () {
        var _this = this;
        var nodes = [this.tree[this.root]];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].l)
                nodes.push(this.tree[nodes[i].l]);
            if (nodes[i].r)
                nodes.push(this.tree[nodes[i].r]);
        }
        return nodes.filter(function (x) { return x; }).map(function (x) {
            try {
                return {
                    key: x.k,
                    // size: x.s,
                    parentkey: x.p ? _this.tree[x.p].k : 0
                };
            }
            catch (e) {
                console.error(e, x);
            }
        }).sort(function (a, b) { return _this.comp(a.key, b.key); });
    };
    return BST;
}());
var Avl = /** @class */ (function (_super) {
    __extends(Avl, _super);
    function Avl(comparator) {
        return _super.call(this, comparator) || this;
    }
    /**
     * deletes the node of the given reference
     * O(log)
    */
    Avl.prototype.remove = function (node) {
        var _a, _b;
        if (!node || !this.tree[node])
            return false;
        var node2 = this.smaller(this.tree[node].r) || this.greater(this.tree[node].l);
        if (!node2) {
            var parent_1 = this.tree[node].p;
            if (!parent_1)
                this.root = undefined;
            else {
                this.connect(parent_1, undefined, node);
                this.updateSize(parent_1, true);
            }
            this.free(node);
            return true;
        }
        this.connect(this.tree[node2].p, (this.tree[node2].l || this.tree[node2].r), node2);
        _a = [this.tree[node].k, this.tree[node2].k], this.tree[node2].k = _a[0], this.tree[node].k = _a[1];
        _b = [this.tree[node].v, this.tree[node2].v], this.tree[node2].v = _b[0], this.tree[node].v = _b[1];
        this.updateSize(this.tree[node2].p, true);
        this.free(node2);
        return true;
    };
    /**
     * adds a node in the tree with the given key and value and returns the reference of the new node
     * O(log)
    */
    Avl.prototype.add = function (k, v) {
        var novo = this.newPointer();
        this.tree[novo] = {
            k: k,
            h: 1,
            v: v,
            s: 1
        };
        if (!this.root)
            return this.root = novo;
        var node = this.root;
        while (true) {
            if (this.comp(this.tree[node].k, this.tree[novo].k) == 0)
                return this.remove(novo), undefined;
            if (this.comp(this.tree[node].k, this.tree[novo].k) > 0) {
                if (this.tree[node].l) {
                    node = this.tree[node].l;
                    continue;
                }
            }
            else {
                if (this.tree[node].r) {
                    node = this.tree[node].r;
                    continue;
                }
            }
            this.connect(node, novo);
            // this.updateSize(node,true);
            // console.log("tree before balance", copy(this.tree));
            this.balance(node);
            // console.log("tree after balance", copy(this.tree));
            return novo;
        }
    };
    Avl.prototype.balance = function (node) {
        var _a;
        // console.log(node);
        while (node) {
            this.updateSize(node);
            var lheight = (this.tree[node].l ? this.tree[this.tree[node].l].h : 0);
            var rheight = (this.tree[node].r ? this.tree[this.tree[node].r].h : 0);
            if (Math.abs(lheight - rheight) <= 1) {
                node = this.tree[node].p;
                continue;
            }
            var x = "l", y = "r";
            if (lheight < rheight)
                _a = [y, x], x = _a[0], y = _a[1];
            var E = this.tree[this.tree[node][x]][y];
            if (E && this.tree[E].h == this.tree[node].h - 2) {
                var upd = this.tree[node][x];
                if (lheight < rheight)
                    this.rotateR(this.tree[node][x], false);
                else
                    this.rotateL(this.tree[node].l, false);
                this.updateSize(upd);
                this.updateSize(this.tree[node][x]);
            }
            if (lheight < rheight)
                this.rotateL(node, false);
            else
                this.rotateR(node, false);
            this.updateSize(node);
            node = this.tree[node].p;
        }
    };
    Avl.prototype.rotateR = function (node, update) {
        if (update === void 0) { update = true; }
        var D = node;
        var B = this.tree[D].l;
        var C = this.tree[B].r;
        this.rotate(D, B, C);
        if (update)
            this.updateSize(D, true);
    };
    Avl.prototype.rotateL = function (node, update) {
        if (update === void 0) { update = true; }
        var D = node;
        var F = this.tree[D].r;
        var E = this.tree[F].l;
        this.rotate(D, F, E);
        if (update)
            this.updateSize(D, true);
    };
    Avl.prototype.rotate = function (X, Z, Y) {
        this.connect(this.tree[X].p, Z);
        this.connect(Z, X);
        this.connect(X, Y, Z);
    };
    Avl.prototype.connect = function (parent, child, cchild) {
        if (!cchild)
            cchild = child;
        if (parent) {
            if (this.comp(this.tree[parent].k, this.tree[cchild].k) > 0)
                this.tree[parent].l = child;
            else
                this.tree[parent].r = child;
        }
        else
            this.root = child;
        if (child)
            this.tree[child].p = parent;
    };
    Avl.prototype.updateSize = function (node, toRoot) {
        if (toRoot === void 0) { toRoot = false; }
        if (!node)
            return false;
        do {
            this.tree[node].s =
                (this.tree[node].l ? this.tree[this.tree[node].l].s : 0) +
                    (this.tree[node].r ? this.tree[this.tree[node].r].s : 0) + 1;
            this.tree[node].h = 1 + Math.max((this.tree[node].l ? this.tree[this.tree[node].l].h : 0), (this.tree[node].r ? this.tree[this.tree[node].r].h : 0));
        } while (toRoot && (node = this.tree[node].p));
    };
    Avl.prototype.checkConsistence = function () {
        if (!this.root)
            return "no nodes";
        if (this.tree[this.root].p)
            return "root has parent";
        for (var node = 1; node < this.tree.length; node++) {
            if (!this.tree[node])
                continue;
            for (var _i = 0, _a = ["p", "l", "r", "s"]; _i < _a.length; _i++) {
                var x = _a[_i];
                if (this.tree[node][x] && typeof (this.tree[node][x]) != 'number')
                    return "invalid pointer";
            }
            if (!this.tree[node].p) {
                if (node != this.root)
                    return "node without parent";
            }
            else {
                if (this.comp(this.tree[this.tree[node].p].k, this.tree[node].k) > 0) {
                    if (this.tree[this.tree[node].p].l != node)
                        return "pointer error";
                }
                else {
                    if (this.tree[this.tree[node].p].r != node)
                        return "pointer error";
                }
            }
            if (this.tree[node].l)
                if (this.comp(this.tree[this.tree[node].l].k, this.tree[node].k) >= 0)
                    return "left child key is not less";
            if (this.tree[node].r)
                if (this.comp(this.tree[this.tree[node].r].k, this.tree[node].k) <= 0)
                    return "right child key is not greater";
            var lsize = (this.tree[node].l ? this.tree[this.tree[node].l].s : 0);
            var rsize = (this.tree[node].r ? this.tree[this.tree[node].r].s : 0);
            if (this.tree[node].s != 1 + lsize + rsize)
                return "wrong size";
            var lheight = (this.tree[node].l ? this.tree[this.tree[node].l].h : 0);
            var rheight = (this.tree[node].r ? this.tree[this.tree[node].r].h : 0);
            if (this.tree[node].h != (lheight > rheight ? lheight : rheight) + 1)
                return "wrong height";
        }
        return "";
    };
    /**
     * returns the height of the tree
     * O(n)
    */
    Avl.prototype.height = function () {
        if (!this.root)
            return 0;
        return this.tree[this.root].h;
    };
    return Avl;
}(BST));
var Treap = /** @class */ (function (_super) {
    __extends(Treap, _super);
    function Treap(comparator) {
        return _super.call(this, comparator) || this;
    }
    /**
     * deletes the node of the given reference
     * O(log)
    */
    Treap.prototype.remove = function (node) {
        if (!this.tree[node])
            return false;
        while (this.tree[node].l && this.tree[node].r) {
            if (this.tree[this.tree[node].l].h > this.tree[this.tree[node].r].h) {
                node = this.tree[node].l;
                this.rotateR(node);
            }
            else {
                node = this.tree[node].r;
                this.rotateL(node);
            }
        }
        if (this.tree[node].l || this.tree[node].r) {
            var parent_2 = this.tree[node].p;
            var child = this.tree[node].l || this.tree[node].r;
            this.tree[child].p = parent_2;
            if (parent_2) {
                if (this.comp(this.tree[child].k, this.tree[parent_2].k) > 0)
                    this.tree[parent_2].r = child;
                else
                    this.tree[parent_2].l = child;
            }
            else {
                this.root = child;
            }
        }
        if (this.tree[node].p) {
            if (this.tree[this.tree[node].p].l === node)
                this.tree[this.tree[node].p].l = undefined;
            else if (this.tree[this.tree[node].p].r === node)
                this.tree[this.tree[node].p].r = undefined;
            this.updateSize(this.tree[node].p, true);
        }
        delete this.tree[node];
        this.freeIndexes.push(node);
        return true;
    };
    /**
     * adds a node in the tree with the given key and value and returns the reference of the new node
     * O(log)
    */
    Treap.prototype.add = function (k, v, h) {
        var novo = this.newPointer();
        this.tree[novo] = {
            k: k,
            h: h ? h : Math.random(),
            v: v,
            s: 1
        };
        if (!(this.root))
            return this.root = novo;
        var node = this.root;
        while (true) {
            if (this.comp(this.tree[node].k, this.tree[novo].k) == 0)
                return this.remove(novo), undefined;
            if (this.comp(this.tree[node].k, this.tree[novo].k) > 0) {
                if (this.tree[node].l) {
                    node = this.tree[node].l;
                    continue;
                }
                this.tree[node].l = novo;
                this.tree[novo].p = node;
                return this.balance(novo);
            }
            else {
                if (this.tree[node].r) {
                    node = this.tree[node].r;
                    continue;
                }
                this.tree[node].r = novo;
                this.tree[novo].p = node;
                return this.balance(novo);
            }
        }
    };
    Treap.prototype.balance = function (node) {
        while (this.tree[node].p) {
            if (this.tree[node].h < this.tree[this.tree[node].p].h)
                break;
            if (this.comp(this.tree[node].k, this.tree[this.tree[node].p].k) > 0)
                this.rotateL(node);
            else
                this.rotateR(node);
            this.updateSize(node);
            node = this.tree[node].p;
            this.updateSize(node);
        }
        if (this.tree[node].p)
            this.updateSize(this.tree[node].p, true);
        return node;
    };
    Treap.prototype.rotateR = function (node) {
        var _a, _b;
        var b = node;
        var d = this.tree[b].p;
        var a = this.tree[b].l;
        var c = this.tree[b].r;
        var e = this.tree[d].r;
        _a = [this.tree[d], this.tree[b]], this.tree[b] = _a[0], this.tree[d] = _a[1];
        _b = [d, b], b = _b[0], d = _b[1];
        if (a)
            this.tree[a].p = b;
        if (c)
            this.tree[c].p = d;
        if (e)
            this.tree[e].p = d;
        this.tree[b].p = this.tree[d].p;
        this.tree[d].p = b;
        this.tree[d].l = c;
        this.tree[b].r = d;
        if (!this.tree[b].p)
            this.root = b;
    };
    Treap.prototype.rotateL = function (node) {
        var _a, _b;
        var d = node;
        var b = this.tree[d].p;
        var a = this.tree[b].l;
        var c = this.tree[d].l;
        var e = this.tree[d].r;
        _a = [this.tree[d], this.tree[b]], this.tree[b] = _a[0], this.tree[d] = _a[1];
        _b = [d, b], b = _b[0], d = _b[1];
        if (a)
            this.tree[a].p = b;
        if (c)
            this.tree[c].p = b;
        if (e)
            this.tree[e].p = d;
        this.tree[d].p = this.tree[b].p;
        this.tree[b].p = d;
        this.tree[d].l = b;
        this.tree[b].r = c;
        if (!this.tree[d].p)
            this.root = d;
    };
    Treap.prototype.updateSize = function (node, toRoot) {
        if (toRoot === void 0) { toRoot = false; }
        do {
            this.tree[node].s =
                (this.tree[node].l ? this.tree[this.tree[node].l].s : 0) +
                    (this.tree[node].r ? this.tree[this.tree[node].r].s : 0) + 1;
        } while (toRoot && (node = this.tree[node].p));
    };
    Treap.prototype.checkConsistence = function () {
        if (!this.root)
            return "no nodes";
        if (this.tree[this.root].p)
            return "root has parent";
        for (var node = 1; node < this.tree.length; node++) {
            if (!this.tree[node])
                continue;
            for (var _i = 0, _a = ["p", "l", "r", "s"]; _i < _a.length; _i++) {
                var x = _a[_i];
                if (this.tree[node][x] && typeof (this.tree[node][x]) != 'number')
                    return "invalid pointer";
            }
            if (!this.tree[node].p) {
                if (node != this.root)
                    return "node without parent";
            }
            else {
                if (this.comp(this.tree[this.tree[node].p].k, this.tree[node].k) > 0) {
                    if (this.tree[this.tree[node].p].l != node)
                        return "pointer error";
                }
                else {
                    if (this.tree[this.tree[node].p].r != node)
                        return "pointer error";
                }
            }
            if (this.tree[node].l && this.tree[this.tree[node].l].p != node)
                return "pointer error";
            if (this.tree[node].r && this.tree[this.tree[node].r].p != node)
                return "pointer error";
            var lsize = (this.tree[node].l ? this.tree[this.tree[node].l].s : 0);
            var rsize = (this.tree[node].r ? this.tree[this.tree[node].r].s : 0);
            if (this.tree[node].s != 1 + lsize + rsize)
                return "wrong size";
            if (this.tree[node].p && this.tree[this.tree[node].p].h < this.tree[node].h)
                return "heap error";
        }
        return "";
    };
    /**
     * returns the height of the tree
     * O(n)
    */
    Treap.prototype.height = function () {
        var ret = {};
        var s = [this.root];
        while (s.length) {
            var top_2 = s.pop();
            if (top_2 < 0) {
                top_2 *= -1;
                ret[top_2] = 1;
                if (this.tree[top_2].l)
                    ret[top_2] = Math.max(ret[top_2], ret[this.tree[top_2].l] + 1);
                if (this.tree[top_2].r)
                    ret[top_2] = Math.max(ret[top_2], ret[this.tree[top_2].r] + 1);
            }
            else {
                s.push(-top_2);
                if (this.tree[top_2].l)
                    s.push(this.tree[top_2].l);
                if (this.tree[top_2].r)
                    s.push(this.tree[top_2].r);
            }
        }
        return ret[this.root];
    };
    return Treap;
}(BST));

function shuffle(v) {
    var _a;
    for (var i = v.length - 1; i > 0; --i) {
        var j = Math.random() * (i + 1) >> 0;
        _a = [v[j], v[i]], v[i] = _a[0], v[j] = _a[1];
    }
}
function copy(obj) {
    if (typeof (obj) != "object")
        return obj;
    var ret = Array.isArray(obj) ? [] : {};
    for (var i in obj)
        ret[i] = copy(obj[i]);
    return ret;
}

function testdiv() {
    document.getElementById("eval").value =
        "console.clear();\nlet n = 1e14 + 1;\nlet cont = [];\nfor (let i = 1; i * i <= n; i++) {\n  if (n % i == 0) {\n    cont.push(i);\n    cont.push(n / i);\n  }\n}\ncont = cont.sort(function (a, b) { return a - b; });\nconsole.log(cont);";
}
function testpi() {
    document.getElementById("eval").value =
        "console.clear();\nlet n = 1e7;\nlet cont = 0;\nfor (let i = 1; i <= n; i++) {\n  let x = Math.random();\n  let y = Math.random();\n  if (x * x + y * y <= 1)\n    cont++;\n}\nconsole.log(4 * cont / n);\nconsole.log(Math.PI);";
}
function testmem() {
    document.getElementById("eval").value =
        "let x = [];\nlet n = 5e5;\nfor(let i=0; i<n; i++){\n  let k = {};\n  k[i] = i+' km';\n  x.push(k);\n}\nconsole.log(x.length);";
}

bstcode = "console.clear();\nlet t = new BST();\nlet n = 2e4;\nlet err = '';\nfor(let i=1; i<=n; i++){\n  let key = 1+Math.random()*n*10>>0;\n  let node = t.find(key);\n  if(node) t.remove(node);\n  else t.add(key);\n  if(i%(n/10) == 0){\n    err = t.checkConsistence();\n    if(err){\n      console.log(i, err);\n      break;\n    }\n  }\n}\nif(!err) console.log(t.height());";
function testtreap(){
    document.getElementById("eval").value = bstcode.replace("BST","Treap");
}
function testavl(){
    document.getElementById("eval").value = bstcode.replace("BST","Avl");
}