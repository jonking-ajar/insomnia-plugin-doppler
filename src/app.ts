import { exec } from 'child_process'
import * as cache from './cache'

interface DopplerMe {
  workplace: { name: string; slug: string }
  type: string
  token_preview: string
  slug: string
  created_at: string
  name: string
  last_seen_at: string
}

interface DopplerSecret {
  computed: string
  computedValueType: { type: string }
  computedVisibility: string
  note: string
}

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
    try {
      await new Promise((resolve, reject) => {
        exec('doppler me --json', (error, stdout, stderr) => {
          if (error) {
            reject(error)
            return
          }
          if (stderr) {
            reject(new Error(stderr))
            return
          }
          const result = JSON.parse(stdout) as DopplerMe
          if (!result.name) {
            reject(new Error('Doppler CLI is not installed or not logged in'))
            return
          }
          resolve(result)
        })
      })
      cache.writeDopplerCliInstalled(true)
    } catch (e) {
      if (e instanceof Error) {
        const err = new Error(
          `There was an issue with the Doppler CLI. If you have the Doppler CLI installed run doppler login. Error details: ${e.message}`,
        )
        err.stack = e.stack
        throw err
      }
    }
  }
}

async function fetchEntry(project: string, config: string, secret: string) {
  const cacheKey = `${project}:${config}-${secret}`
  const existing = cache.getEntry(cacheKey)

  if (existing) {
    return existing
  }
  const secretValue = await new Promise<string>((resolve, reject) => {
    exec(`doppler secrets get --project ${project} --config ${config} --json ${secret}`, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      if (stderr) {
        reject(new Error(stderr))
        return
      }

      const result = JSON.parse(stdout) as Record<string, DopplerSecret>
      if (!Object.keys(result).includes(secret)) {
        reject(new Error('Secret Value not found'))
        return
      }
      resolve(result[secret].computed)
    })
  })

  cache.writeEntry(cacheKey, secretValue)

  return secretValue
}

export const templateTags = [fetchSecretTemplateTag]
