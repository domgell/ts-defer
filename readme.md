# defer
The `using` keyword and `[Symbol.dispose]` can be used to automatically call a function at the end of the current scope.

# Example
`Defer()` creates an object with the `[Symbol.dispose]` property. At the end of the scope, it will call all callbacks (in reverse order). 

```ts
using defer = Defer();
 
const file = openFile();
defer(() => file.close());
... 
// `file.close()` is called at the end of the scope
```

`deferred(obj, fn)` attaches `[Symbol.dispose]` to an existing object and calls the callback at the end of the scope.
```ts
using file = deferred(openFile(), f => f.close());
...
// `f.close()` is called at the end of the scope
```

With the `using` keyword, everything is cleaned up in **reverse order**. This is also implemented for `Defer()`, where callbacks are called in reverse order.
```ts
// Prints '1, 2, 3' at the end of the scope
using defer = Defer();
defer(() => console.log(3))
defer(() => console.log(2))
defer(() => console.log(1))
```