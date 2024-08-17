import { writable } from "svelte/store"

export let app = writable(
  {}
)

let theApp

lib().sub((i) => {
  theApp = i
})

export function lib() {
  let _ = {
    sub: (cb) => {
      app.subscribe((i) => { cb(i) })
    },
    update: (cb) => {
      app.update((i) => {
        cb(i)
        return i
      })
      app = app
    },
    log: () => {
      console.log(theApp)
    }
  }
  return _
}