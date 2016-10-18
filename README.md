# babel-plugin-app-decorators-component

### The goal of this babel-plugin for app-decorators @component:

#### Example 1 (required)
in:
```js
@component()
class Helloworld {

}
```
out:
```js
@component()
class Helloworld extend HTMLElement {

}
```

#### Example 2 (required)
in:
```js
@component({
   extends: 'img'
})
class Helloworld {

}
```

out:
```js
@component({
   extends: 'img'
})
class Helloworld extends HTMLImageElement {

}
```

#### Example 3 (not required)
in:
```js

class Foo  {}
class Bar extends Foo {}

@component({
   extends: 'form'
})
class Helloworld extends Bar {

}
```

out:
```js
class Foo extends HTMLFormElement {}
class Bar extends Foo {}

@component({
   extends: 'img'
})
class Helloworld extends Bar {

}
```