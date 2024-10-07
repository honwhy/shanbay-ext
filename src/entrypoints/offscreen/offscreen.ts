import { ExAction } from '../types'

browser.runtime.onMessage.addListener((request) => {
  if (request.action === ExAction.PlayAudio) {
    const url = request.url
    const audio = new Audio(url)
    audio.volume = 1
    audio.play()
  }
})
