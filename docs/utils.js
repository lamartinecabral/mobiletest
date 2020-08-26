var Bbt = /** @class */ (function () {
    function Bbt(comparator) {
        this.tree = [null];
        this.freeIndexes = [];
        if (comparator)
            this.comp = comparator;
        else
            this.comp = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); };
    }
    Bbt.prototype.newPointer = function () {
        if (this.freeIndexes.length)
            return this.freeIndexes.pop();
        this.tree.push(undefined);
        return this.tree.length - 1;
    };
    Bbt.prototype.free = function (node) {
        this.freeIndexes.push(node);
        delete this.tree[node];
    };
    /**
     * returns the quantity of nodes in the tree
     * O(1)
    */
    Bbt.prototype.size = function () { return this.root ? this.tree[this.root].s : 0; };
    /**
     * returns an object with key and value of the node from the given reference
     * O(1)
    */
    Bbt.prototype.get = function (pointer) { return { key: this.tree[pointer].k, value: this.tree[pointer].v }; };
    /**
     * returns a reference for the node with the given key
     * O(log)
    */
    Bbt.prototype.find = function (key) {
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
     * returns a reference for the node with the kth greater key
     * O(log)
    */
    Bbt.prototype.kth = function (i) {
        if (!i)
            return undefined;
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
    Bbt.prototype.order = function (key) {
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
    Bbt.prototype.inOrder = function (callback) {
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
    Bbt.prototype.smaller = function (node) {
        while (this.tree[node].l)
            node = this.tree[node].l;
        return node;
    };
    Bbt.prototype.greater = function (node) {
        while (this.tree[node].r)
            node = this.tree[node].r;
        return node;
    };
    /**
     * return reference for the next node in a in order traversal of the tree
     * O(1) amortized
    */
    Bbt.prototype.next = function (node) {
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
    Bbt.prototype.prev = function (node) {
        if (this.tree[node].l)
            return this.greater(this.tree[node].l);
        while (this.tree[node].p && node == this.tree[this.tree[node].p].l)
            node = this.tree[node].p;
        if (this.tree[node].p)
            return this.tree[node].p;
        return undefined;
    };
    /**
     * deletes the node of the given reference
     * O(log)
    */
    Bbt.prototype.remove = function (node) {
        var _a, _b, _c, _d;
        var d = node;
        var b = this.tree[d].l;
        var a = b ? this.tree[b].l : b;
        var c = b ? this.tree[b].r : b;
        var f = this.tree[d].r;
        var e = f ? this.tree[f].l : f;
        var g = f ? this.tree[f].r : f;
        if (b && f) {
            if (!c) {
                this.tree[f].l = b;
                this.tree[f].p = this.tree[d].p;
                this.tree[g].p = d;
                _a = [this.tree[d], this.tree[f]], this.tree[f] = _a[0], this.tree[d] = _a[1];
                delete this.tree[f];
                this.freeIndexes.push(f);
                if (e)
                    this.tree[e].p = b;
                this.tree[b].r = e;
                this.updateSize(b);
            }
            else {
                var F = this.smaller(f);
                this.tree[b].r = f;
                this.tree[b].p = this.tree[d].p;
                this.tree[a].p = d;
                _b = [this.tree[d], this.tree[b]], this.tree[b] = _b[0], this.tree[d] = _b[1];
                delete this.tree[b];
                this.freeIndexes.push(b);
                if (c)
                    this.tree[c].p = F;
                this.tree[F].l = c;
                this.updateSize(F);
            }
        }
        else if (b) {
            if (a)
                this.tree[a].p = d;
            this.tree[d].l = a;
            if (c)
                this.tree[c].p = d;
            this.tree[d].r = c;
            _c = [this.tree[d], this.tree[b]], this.tree[b] = _c[0], this.tree[d] = _c[1];
            delete this.tree[b];
            this.freeIndexes.push(b);
            if (this.tree[d].p)
                this.updateSize(this.tree[d].p);
        }
        else if (f) {
            if (e)
                this.tree[e].p = d;
            this.tree[d].l = e;
            if (g)
                this.tree[g].p = d;
            this.tree[d].r = g;
            _d = [this.tree[d], this.tree[b]], this.tree[b] = _d[0], this.tree[d] = _d[1];
            delete this.tree[b];
            this.freeIndexes.push(b);
            if (this.tree[d].p)
                this.updateSize(this.tree[d].p);
        }
        else {
            var D = this.tree[d].p;
            if (D) {
                if (this.tree[D].l == d)
                    this.tree[D].l = undefined;
                else
                    this.tree[D].r = undefined;
                this.updateSize(D);
            }
            else
                this.root = undefined;
            delete this.tree[d];
            this.freeIndexes.push(d);
        }
    };
    /**
     * adds a node in the tree with the given key and value and returns the reference of the new node
     * O(log)
    */
    Bbt.prototype.add = function (k, v, h) {
        var novo = this.newPointer();
        this.tree[novo] = {
            k: k,
            v: v,
            s: 1
        };
        if (!this.root)
            return this.root = novo;
        var node = this.root;
        while (true) {
            if (this.comp(this.tree[node].k, k) == 0)
                return this.free(node), undefined;
            if (this.comp(this.tree[node].k, k) > 0) {
                if (this.tree[node].l)
                    node = this.tree[node].l;
                else {
                    this.tree[node].l = novo;
                    break;
                }
            }
            else {
                if (this.tree[node].r)
                    node = this.tree[node].r;
                else {
                    this.tree[node].r = novo;
                    break;
                }
            }
        }
        this.tree[novo].p = node;
        return this.updateSize(node);
    };
    Bbt.prototype.updateSize = function (node) {
        var balance;
        do {
            var lsize = (this.tree[node].l ? this.tree[this.tree[node].l].s : 0);
            var rsize = (this.tree[node].r ? this.tree[this.tree[node].r].s : 0);
            this.tree[node].s = lsize + rsize + 1;
            if (lsize + rsize > 1 && (lsize > rsize ? lsize : rsize) > 2 * (lsize < rsize ? lsize : rsize))
                balance = node;
        } while (node = this.tree[node].p);
        return balance ? this.rebalance(balance) : node;
    };
    Bbt.prototype.rebalance = function (node) {
        var last = this.greater(node);
        var nodes = [];
        for (var i = this.smaller(node); true; i = this.next(i)) {
            nodes.push(i);
            if (i == last)
                break;
        }
        var parent = this.tree[node].p;
        node = nodes[nodes.length - 1 >> 1];
        if (parent) {
            if (this.comp(this.tree[parent].k, this.tree[node].k) > 0)
                this.tree[parent].l = node;
            else
                this.tree[parent].r = node;
        }
        else
            this.root = node;
        this.tree[node].p = parent;
        this.tree[node].l = this.tree[node].r = undefined;
        this.tree[node].s = 1;
        var s = [];
        if (nodes.length > 1)
            s.push([0, nodes.length - 1]);
        while (s.length) {
            var i = s.pop();
            if (typeof i == "number") {
                if (this.tree[i].l)
                    this.tree[i].s += this.tree[this.tree[i].l].s;
                if (this.tree[i].r)
                    this.tree[i].s += this.tree[this.tree[i].r].s;
                continue;
            }
            var mid = (i[0] + i[1]) >> 1;
            if (i[0] < i[1])
                s.push(nodes[mid]);
            if (mid > i[0]) {
                var midl = (i[0] + mid - 1) >> 1;
                this.tree[nodes[mid]].l = nodes[midl];
                this.tree[nodes[midl]].p = nodes[mid];
                this.tree[nodes[midl]].s = 1;
                this.tree[nodes[midl]].l = this.tree[nodes[midl]].r = undefined;
                if (i[0] != mid - 1)
                    s.push([i[0], mid - 1]);
            }
            if (mid < i[1]) {
                var midr = (mid + 1 + i[1]) >> 1;
                this.tree[nodes[mid]].r = nodes[midr];
                this.tree[nodes[midr]].p = nodes[mid];
                this.tree[nodes[midr]].s = 1;
                this.tree[nodes[midr]].l = this.tree[nodes[midr]].r = undefined;
                if (i[1] != mid + 1)
                    s.push([mid + 1, i[1]]);
            }
        }
        return node;
    };
    /**
     * returns an array with all the nodes with details about the structure of the tree
    */
    Bbt.prototype.prettify = function () {
        var _this = this;
        return this.tree.filter(function (x) { return x; }).map(function (x) {
            try {
                return {
                    key: x.k,
                    size: x.s,
                    parent: x.p ? _this.tree[x.p].k : '',
                    lsize: x.l ? _this.tree[x.l].s : '',
                    rsize: x.r ? _this.tree[x.r].s : '',
                    left: x.l ? _this.tree[x.l].k : '',
                    right: x.r ? _this.tree[x.r].k : ''
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
    Bbt.prototype.heigth = function () {
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
    return Bbt;
}());
function random_shuffle(v) {
    var _a;
    for (var i = v.length - 1; i > 0; --i) {
        var j = Math.random() * (i + 1) >> 0;
        _a = [v[j], v[i]], v[i] = _a[0], v[j] = _a[1];
    }
}
function testdiv(n) {
    console.clear();
    if (!n)
        n = 1e14 + 1;
    var cont = [];
    for (var i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            cont.push(i);
            cont.push(n / i);
        }
    }
    cont = cont.sort(function (a, b) { return a - b; });
    console.log(cont);
}
function testpi(n) {
    console.clear();
    if (!n)
        n = 1e7;
    var cont = 0;
    for (var i = 1; i <= n; i++) {
        var x = Math.random();
        var y = Math.random();
        if (x * x + y * y <= 1)
            cont++;
    }
    console.log(4 * cont / n);
    console.log(Math.PI);
}
