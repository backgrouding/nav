import nav from '../../data';
import { BACKGROUND_LINEAR } from '../../config';

export function debounce(func, wait, immediate) {
  let timeout

  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)

    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function fuzzySearch(navList: any[], keyword: string) {
  let searchResultList = [{ nav: [] }]

  function f(arr?: any[]) {
    arr = arr || navList

    for (let i = 0; i < arr.length; i++) {

      if (Array.isArray(arr[i].nav)) {
        f(arr[i].nav)
      }

      if (arr[i].name) {
        const name = arr[i].name.toLowerCase()
        const desc = arr[i].desc.toLowerCase()
        const search = keyword.toLowerCase()

        if (~name.indexOf(search) || ~desc.indexOf(search)) {
          try {
            let result = Object.assign({}, arr[i])
            const regex = new RegExp(`(${keyword})`, 'i')
            result.name = result.name.replace(regex, `$1`.bold())
            result.desc = result.desc.replace(regex, `$1`.bold())

            const idx = searchResultList[0].nav.findIndex(item => item.name === result.name)
            if (idx === -1) {
              searchResultList[0].nav.push(result)
            }
          } catch (err) {}
        }
      }
    }
  }

  f()

  return searchResultList
}

export function totalWeb(): number {
  let total = 0;
  function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      if (nav[i].link) {
        total += 1
      } else {
        r(nav[i].nav)
      }
    }
  }
  r(nav)

  return total
}

export function randomBgImg() {
  const el = document.createElement('div')
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-3;transition: 1s linear;'
  el.style.backgroundImage = BACKGROUND_LINEAR[randomInt(BACKGROUND_LINEAR.length)]
  document.body.appendChild(el)

  function setBg() {
    const randomBg = BACKGROUND_LINEAR[randomInt(BACKGROUND_LINEAR.length)]
    el.style.opacity = '.3'
    setTimeout(() => {
      el.style.backgroundImage = randomBg
      el.style.opacity = '1'
    }, 1000)
  }

  setInterval(setBg, 10000)
}

export function onImgError(e: any) {
  e.target.src = 'assets/img/transparent.gif'
}
