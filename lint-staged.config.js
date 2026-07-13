import path from 'node:path'

export default {
  // Catch every file extension supported by your Antfu configuration
  '**/*.{ts,vue,css,js,json,yaml,yml,toml,md,html}': (stagedFiles) => {
    const commands = []
    const packagesToSweep = new Set()
    const rootFilesToLint = []

    stagedFiles.forEach((file) => {
      // Find the relative directory path from the project root
      const relativePath = path.relative(process.cwd(), file)
      const segments = relativePath.split(path.sep)

      // Route files matching nested workspace layout structures
      if (segments.length >= 2 && (segments[0] === 'apps' || segments[0] === 'packages')) {
        const workspaceType = segments[0] // e.g. "apps" or "packages"
        const workspaceFolder = segments[1] // e.g. "api-gateway", "configs", etc.
        packagesToSweep.add(`${workspaceType}/${workspaceFolder}`)
      }
      else {
        // If it's a loose configuration file at the root, collect the exact file path safely
        rootFilesToLint.push(relativePath)
      }
    })

    // 1. If any root files are staged, lint ONLY those specific files explicitly
    if (rootFilesToLint.length > 0) {
      const filesString = rootFilesToLint.join(' ')
      commands.push(`bunx --bun eslint --config packages/configs/eslint.config.ts --fix ${filesString}`)
    }

    // 2. Execute isolated workspace routines on the targeted folder contexts
    packagesToSweep.forEach((target) => {
      commands.push(`bun --cwd ${target} lint:fix`)
    })

    return commands
  },
}
