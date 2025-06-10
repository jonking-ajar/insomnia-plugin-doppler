import * as cache from './cache'
import { dopplerCliInstalled, getSecret } from './doppler'

const fetchSecretTemplateTag = {
  name: 'dopplersecret',
  displayName: 'Doppler => Fetch Secret',
  liveDisplayName: (args: any[]) => {
    return `Doppler => ${args[0]?.value ?? '--'} => ${args[1]?.value ?? '--'} => ${args[2]?.value ?? '--'}`
  },
  description: 'Fetch a secret from your Doppler Config',
  args: [
    {
      displayName: 'project',
      description: 'Doppler Project Name',
      type: 'string',
      defaultValue: 'pit',
      placeholder: 'e.g. web-frontend',
    },
    {
      displayName: 'config',
      description: 'Doppler Config Name',
      type: 'string',
      defaultValue: 'prd',
      placeholder: 'e.g. prd_config',
    },
    {
      displayName: 'secret',
      description: 'Doppler Secret Name',
      type: 'string',
      defaultValue: '',
      placeholder: 'e.g. API_KEY',
    },
  ],

  async run(context: unknown, project: string, config: string, secret: string) {
    await checkCli()
    const entry = await fetchEntry(project, config, secret)

    return entry
  },
}

async function checkCli() {
  if (cache.dopplerCliInstalled() !== true) {
    const dopplerInstalled = await dopplerCliInstalled()
    cache.writeDopplerCliInstalled(dopplerInstalled)
  }
}

async function fetchEntry(project: string, config: string, secret: string) {
  const cacheKey = `${project}:${config}-${secret}`
  const existing = cache.getEntry(cacheKey)

  if (existing) {
    return existing
  }
  const secretValue = await getSecret(project, config, secret)

  cache.writeEntry(cacheKey, secretValue)

  return secretValue
}

export const templateTags = [fetchSecretTemplateTag]
