import fs from 'node:fs'
import path from 'node:path'

// Function to create the directory if it does not exist
function ensureDirectoryExists(directory) {
  if (!['apps', 'packages'].includes(directory.split('/')[0])) {
    console.error(
      'Specified directory must be subdirectory of apps/ or packages/'
    )
    process.exit(1)
  }
  const resolvedDir = path.resolve(directory)
  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true })
  }
}

// Main function to create the package structure
function createPackage(directory, packageName) {
  // Ensure the package directory exists
  ensureDirectoryExists(directory)
  const packageDir = path.resolve(directory)

  // Define the contents of tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      rootDir: './src',
      outDir: './build',
    },
  }

  // Define the contents of package.json
  const packageJson = {
    name: packageName,
    version: '1.0.0',
    author: '',
    license: 'MIT',
    description: '',
    type: 'module',
    main: 'build/index.js',
    scripts: {
      build: 'tsc --build',
    },
  }

  // Paths to the files to create
  const tsconfigPath = path.join(packageDir, 'tsconfig.json')
  const packageJsonPath = path.join(packageDir, 'package.json')
  const srcDir = path.join(packageDir, 'src')
  const indexTsPath = path.join(srcDir, 'index.ts')

  // Write tsconfig.json
  fs.writeFileSync(
    tsconfigPath,
    `${JSON.stringify(tsconfig, null, 2)}\n`,
    'utf8'
  )
  console.log(`Created tsconfig.json at ${tsconfigPath}`)

  // Write package.json
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8'
  )
  console.log(`Created package.json at ${packageJsonPath}`)

  // Create an empty index.ts file
  fs.mkdirSync(srcDir)
  fs.writeFileSync(indexTsPath, '', 'utf8')
  console.log(`Created src/index.ts at ${indexTsPath}`)

  console.log(
    'Package setup completed successfully. Run `npm i` in terminal to symlink new package'
  )
}

// Retrieve arguments from the command line
const [directory, packageName] = process.argv.slice(2)

// Validate arguments
if (!directory || !packageName) {
  console.error('Usage: node create-package.js <directory> <packageName>')
  process.exit(1)
}

// Run the script with provided arguments
createPackage(directory, packageName)
