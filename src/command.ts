import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Finds the absolute path of an executable by searching in common directories
 * across different operating systems. This is a robust way to find a command
 * when the process's PATH might be incomplete.
 *
 * @param command The executable name to find (e.g., 'doppler').
 * @returns A promise that resolves to the absolute path of the command, or null if not found.
 */
async function findExecutablePath(command: string): Promise<string | null> {
  // Determine the executable name based on the OS (e.g., doppler.exe on Windows)
  const commandWithExt = process.platform === 'win32' ? `${command}.exe` : command

  // Define common installation directories for each platform
  const searchPaths: string[] = []
  const homeDir = process.env.HOME || process.env.USERPROFILE || ''

  if (process.platform === 'win32') {
    // Windows search paths
    searchPaths.push(
      process.env.ProgramFiles ? path.join(process.env.ProgramFiles, 'Doppler') : '',
      process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Doppler') : '',
      path.join('C:', 'ProgramData', 'Doppler', 'bin'), // Common installer location
    )
  } else {
    // macOS and Linux search paths
    searchPaths.push(
      '/usr/local/bin',
      '/opt/homebrew/bin', // For Apple Silicon Homebrew
      '/usr/bin',
      '/bin',
      path.join(homeDir, '.local', 'bin'),
    )
  }

  // Also include directories from the current process's PATH environment variable
  const pathDirs = process.env.PATH?.split(path.delimiter) || []
  const allPathsToSearch = [...new Set([...searchPaths, ...pathDirs])].filter(Boolean)

  // Check each path for the existence of the executable
  for (const dir of allPathsToSearch) {
    const fullPath = path.join(dir, commandWithExt)
    try {
      // Check if the file exists and is executable
      await fs.promises.access(fullPath, fs.constants.X_OK)
      console.log(`Executable found at: ${fullPath}`)
      return fullPath
    } catch (error) {
      // File not found or not executable, continue to the next path
    }
  }

  console.warn(`Executable '${command}' not found in any of the searched paths.`)
  return null // Return null if not found in any path
}

/**
 * Executes a command with arguments in a platform-agnostic way. It first finds
 * the executable's absolute path and then spawns a child process.
 *
 * @param command The command to execute (e.g., 'doppler').
 * @param args An array of string arguments for the command.
 * @returns A promise that resolves with the command's stdout, or rejects with an error.
 */
export async function runCommand(command: string, args: string[]): Promise<string> {
  const executablePath = await findExecutablePath(command)

  if (!executablePath) {
    const errorMessage = `Command not found: '${command}'. Ensure it's installed and accessible.`
    // Mimic the shell error for consistency
    if (process.platform !== 'win32') {
      return Promise.reject(new Error(`/bin/sh: ${command}: command not found`))
    }
    return Promise.reject(new Error(errorMessage))
  }

  return new Promise((resolve, reject) => {
    console.log(`Executing: ${executablePath} ${args.join(' ')}`)

    // Use spawn for security and efficiency
    const child = spawn(executablePath, args)

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim())
      } else {
        const error = new Error(
          `Command failed with exit code ${code}: ${executablePath} ${args.join(' ')}\n\nStderr:\n${stderr.trim()}`,
        )
        reject(error)
      }
    })

    child.on('error', (err) => {
      // This event fires for issues like permissions errors when spawning
      reject(new Error(`Failed to start command: ${err.message}`))
    })
  })
}
