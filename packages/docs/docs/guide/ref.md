# Refs

## `Ref`

<<< ./ref-example.ts#snippet

Under hood `Ref` is [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject).  
So everything you can do with `BehaviorSubject` you can do with `Ref`. For example:
* You can [subscribe](https://rxjs.dev/guide/subscription) to `Ref`'s changes
* You can use [operators](https://rxjs.dev/guide/operators) to create new `observables` from `Ref`


What is different from original `BehaviorSubject` is it's `value` property.

 * `value` is settable. It calls `next` method under hood.
 * `value` is trackable. See [computed](./computed.md) section for more information
 * When `value` has type `object` or `array` - it returns [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), that triggers `next` method when you
   * change inner properties of object
   * call object or array methods 

Examples of `Ref` usage are available on [component syntax](../guide/component-syntax.md) page.


## `ReadonlyRef`

Readonly ref cannot be created explicitly, but it is used in [computed functions](./computed.md) and in sections below.

The differences from `Ref` are that:

* `value` is not settable
* When `value` has type `object` or `array` - it returns [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), that prevents any changes and throws error.

## `toRef`

Helper function that creates different refs from `RxJs Observables`.

* `toRef<T>( arg: Observable<T> )` - will create `ReadonlyRef` from any `Observable`.  
   This may be useful if you want to access latest emitted value of some event for example.
  
* `toRef<T>( arg: Observable<T>, setter: (value:T) => void  )` will create `WritableReadonlyRef`
  * `WritableReadonlyRef` is `Ref` that uses your setter function to apply changes.  
  There is only difference from classic `Ref`.
