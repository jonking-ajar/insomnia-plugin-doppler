import { runCommand } from './command'
import { DopplerMe, DopplerSecret } from './types'

export const dopplerCliInstalled = async () => {
  try {
    const me = await runCommand('doppler', ['me', '--json'])
    const result = JSON.parse(me) as DopplerMe
    if (!result.name) {
      throw new Error('Doppler CLI is not installed or not logged in')
    }
    return true
  } catch (e) {
    if (e instanceof Error) {
      const err = new Error(
        `There was an issue with the Doppler CLI. If you have the Doppler CLI installed run doppler login. Error details: ${e.message}`,
      )
      err.stack = e.stack
      throw err
    }
  }
  return false
}

export const getSecret = async (project: string, config: string, secret: string) => {
  const secretValue = await runCommand('doppler', [
    'secrets',
    'get',
    '--project',
    project,
    '--config',
    config,
    '--json',
    secret,
  ])
  const result = JSON.parse(secretValue) as Record<string, DopplerSecret>
  if (!Object.keys(result).includes(secret)) {
    throw new Error('Secret Value not found')
  }
  return result[secret].computed
}
