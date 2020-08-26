# [mobiletest](https://lamart-mobiletest.web.app/)
### Just a little thing to experiment some codes while on mobile
packages included:
- [Eruda](https://eruda.liriliri.io/)
- [RxJS](https://github.com/ReactiveX/rxjs)
- [Moment.js](https://momentjs.com/)

I also included a implementation of a self-balancing binary search tree. Currently in beta, so it may have bugs.

Usage example:
```javascript
// comparator function is optional
let t = new Bbt((a,b)=>a-b);
// pair key,value. value is optional
for(let key of [4,7,6,2,3]) t.add(key,null);
// array with all nodes of the tree
console.log( t.prettify() );
console.log( t.heigth() );
// element with key equal to 3
console.log( t.get(t.find(3)) );
t.remove(t.find(7));
let first = t.kth(1);
// first element
console.log( t.get(first) );
// second element making use of the reference of the first
console.log( t.get(t.next(first)) );
// last element
console.log( t.get(t.kth(t.size())) );
// position of the element with key 6
console.log( t.order(t.find(6)) );
// in order traversal. callback for every element
t.inOrder(console.log);
// example of traversal from last to first
for(let i = t.kth(t.size()); i; i = t.prev(i))
  console.log( t.get(i) );
```
