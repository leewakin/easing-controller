import * as easingFunctions from './easings'

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

export function createAnimation(
  easing: EasingName | EasingFunction,
  options?: AnimationOptions
): AnimationControls {
  if (typeof easing === 'string') {
    const easingFunction = easingFunctions[easing]

    if (!easingFunction) {
      throw new Error(
        `The easing function "${easing}" does not exist, please use one of the following: ${Object.keys(
          easingFunctions
        ).join(', ')}`
      )
    }
    easing = easingFunction
  }

  const { promise, resolve } = Promise.withResolvers<void>()

  const _options = Object.assign(
    {},
    {
      from: 0,
      to: 1,
      duration: 300,
      immediate: true,
      loop: false,
      reverse: false,
    },
    options
  )

  let isPaused = false
  let startTime = Date.now()
  let currentTime = Date.now()
  let elapsedTime = 0
  let progress = 0
  let value = _options.reverse ? _options.to : _options.from
  let y = 0

  function callCallback() {
    const status: AnimationStatus = {
      value,
      y,
      progress,
    }

    _options.callback?.(status)
    _options.onStep?.(status)
  }

  function isEnded() {
    const ended =
      (_options.reverse && progress <= 0) ||
      (!_options.reverse && progress >= 1)
    if (ended) {
      _options.onEnd?.()
    }
    return ended
  }

  function animateStep() {
    requestAnimationFrame(function step() {
      if (isPaused) {
        return
      }

      currentTime = Date.now()
      elapsedTime = currentTime - startTime
      progress = Math.min(elapsedTime / _options.duration, 1)

      if (_options.reverse) {
        progress = 1 - progress
      }

      y = (easing as EasingFunction)(progress)
      value = _options.from + (_options.to - _options.from) * y

      callCallback()

      if (isEnded()) {
        if (_options.loop) {
          start()
        } else {
          resolve()
        }
      } else {
        requestAnimationFrame(step)
      }
    })
  }

  function start() {
    startTime = Date.now()
    currentTime = Date.now()
    elapsedTime = 0
    progress = 0
    value = _options.reverse ? _options.to : _options.from
    y = 0

    isPaused = false

    requestAnimationFrame(animateStep)
  }

  function reverse() {
    _options.reverse = !_options.reverse
  }

  function resume() {
    if (isPaused) {
      isPaused = false
      startTime += Date.now() - currentTime
      requestAnimationFrame(animateStep)
    }
  }

  function pause() {
    isPaused = true
  }

  function stop() {
    isPaused = true
    startTime = Date.now()

    resolve()
  }

  if (_options.immediate) {
    start()
  }

  return {
    start,
    reverse,
    resume,
    pause,
    stop,
    promise,
  }
}
