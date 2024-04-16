# easing-controller <a href="https://npmjs.com/package/easing-controller"><img src="https://img.shields.io/npm/v/easing-controller" alt="npm package"></a>

A controller for [easing functions](https://easings.net/), which allows for quick use of easing functions, and supports convenient operations such as pause, resume, and reverse.

## Install

With NPM:

```bash
$ npm install easing-controller
```

With Yarn:

```bash
$ yarn install easing-controller
```

With PNPM:

```bash
$ pnpm install easing-controller
```

## Usage

Quick start

```ts
import { createAnimation } from 'easing-controller'

createAnimation('easeInQuad', {
  from: 0,
  to: 200,
  callback({ value }) {
    console.log('value: ', value)
  },
})
```

Manual control

```ts
import { createAnimation } from 'easing-controller'

const { start } = createAnimation('easeInQuad', {
  immediate: false,
  callback(status) {
    console.log('status: ', status)
  },
})

start()
```

Custom easing functions

```ts
import { createAnimation } from 'easing-controller'

createAnimation(x => x, {
  callback(status) {
    console.log('status: ', status)
  },
})
```

### Types

```ts
export type EasingName = keyof typeof easingFunctions

export type EasingFunction = (x: number) => number

export interface AnimationStatus {
  /**
   * value is the current value of the animation, it is between from and to
   */
  value: number

  /**
   * y is the value of the easing function
   */
  y: number

  /**
   * progress is the x value of the easing function from 0 to 1
   */
  progress: number
}

export interface AnimationOptions {
  /**
   * The starting value of the animation
   */
  from?: number

  /**
   * The ending value of the animation
   */
  to?: number

  /**
   * The duration of the animation in milliseconds
   *
   * @default 300
   */
  duration?: number

  /**
   * The animation will start immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * The animation will loop forever
   *
   * @default false
   */
  loop?: boolean

  /**
   * Reverse the animation
   *
   * @default false
   */
  reverse?: boolean

  /**
   * The callback of each step
   */
  callback?: (status: AnimationStatus) => void

  /**
   * The alias of the callback
   */
  onStep?: (status: AnimationStatus) => void

  /**
   * The callback when the animation ends
   */
  onEnd?: () => void
}

export interface AnimationControls {
  start: () => void
  reverse: () => void
  resume: () => void
  pause: () => void
  stop: () => void
  promise: Promise<void>
}
```

## TODO

- 支持动画结束倒放一遍等
