var Treap = /** @class */ (function () {
    function Treap(comparator) {
        this.tree = [null];
        this.freeIndexes = [];
        if (comparator)
            this.comp = comparator;
        else
            this.comp = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); };
    }
    Treap.prototype.newPointer = function () {
        if (this.freeIndexes.length)
            return this.freeIndexes.pop();
        this.tree.push(undefined);
        return this.tree.length - 1;
    };
    /**
     * returns the quantity of node in the tree
     * O(1)
    */
    Treap.prototype.size = function () { return !(this.root) ? 0 : this.tree[this.root].s; };
    /**
     * returns an object with key and value of the node from the given reference
     * O(1)
    */
    Treap.prototype.get = function (pointer) { return { key: this.tree[pointer].k, value: this.tree[pointer].v }; };
    /**
     * returns a reference for the node with the given key
     * O(log)
    */
    Treap.prototype.find = function (key) {
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
            var parent_1 = this.tree[node].p;
            var child = this.tree[node].l || this.tree[node].r;
            this.tree[child].p = parent_1;
            if (parent_1) {
                if (this.comp(this.tree[child].k, this.tree[parent_1].k) > 0)
                    this.tree[parent_1].r = child;
                else
                    this.tree[parent_1].l = child;
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
    Treap.prototype.smaller = function (node) {
        while (this.tree[node].l)
            node = this.tree[node].l;
        return node;
    };
    Treap.prototype.greater = function (node) {
        while (this.tree[node].r)
            node = this.tree[node].r;
        return node;
    };
    /**
     * return reference for the next node in a in order traversal of the tree
     * O(1) amortized
    */
    Treap.prototype.next = function (node) {
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
    Treap.prototype.prev = function (node) {
        if (this.tree[node].l)
            return this.greater(this.tree[node].l);
        while (this.tree[node].p && node == this.tree[this.tree[node].p].l)
            node = this.tree[node].p;
        if (this.tree[node].p)
            return this.tree[node].p;
        return undefined;
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
    /**
     * returns a reference for the node with the kth greater key
     * O(log)
    */
    Treap.prototype.kth = function (i) {
        if (!i)
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
    Treap.prototype.order = function (key) {
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
    Treap.prototype.inOrder = function (callback) {
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
     * returns an array with all the nodes with details about the structure of the tree
    */
    Treap.prototype.prettify = function () {
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
    /**
     * returns the height of the tree
     * O(n)
    */
    Treap.prototype.heigth = function () {
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
}());
function random_shuffle(v) {
    var _a;
    for (var i = v.length - 1; i > 0; --i) {
        var j = Math.random() * (i + 1) >> 0;
        _a = [v[j], v[i]], v[i] = _a[0], v[j] = _a[1];
    }
}
function testdiv() {
    document.getElementById("eval").value =
        "console.clear();\nlet n = 1e14 + 1;\nlet cont = [];\nfor (let i = 1; i * i <= n; i++) {\n  if (n % i == 0) {\n    cont.push(i);\n    cont.push(n / i);\n  }\n}\ncont = cont.sort(function (a, b) { return a - b; });\nconsole.log(cont);";
}
function testpi() {
    document.getElementById("eval").value =
        "console.clear();\nlet n = 1e7;\nlet cont = 0;\nfor (let i = 1; i <= n; i++) {\n  let x = Math.random();\n  let y = Math.random();\n  if (x * x + y * y <= 1)\n    cont++;\n}\nconsole.log(4 * cont / n);\nconsole.log(Math.PI);";
}
function testtreap(){
    document.getElementById("eval").value =
        "console.clear();\nlet t = new Treap();\nlet n = 2e4;\nfor(let i=1; i<=n; i++){\n  let key = Math.random()*n*10>>0;\n  let node = t.find(key);\n  if(node) t.remove(node);\n  else t.add(key);\n  if(i%(n/10) == 0){\n    let err = t.checkConsistence();\n    if(err){\n      console.log(i, err);\n      break;\n    }\n  }\n}";
}