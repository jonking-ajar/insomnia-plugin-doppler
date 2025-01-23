import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 60 * 60 })

export function writeEntry(ref: string, value: string | number) {
  return cache.set(ref, value)
}

export function getEntry(ref: string) {
  return cache.get(ref)
}

export function dopplerCliInstalled() {
  return cache.get('dopplerCliInstalled')
}

export function writeDopplerCliInstalled(installed: boolean) {
  return cache.set('dopplerCliInstalled', installed)
}
