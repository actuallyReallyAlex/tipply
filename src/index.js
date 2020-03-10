import 'core-js/stable'
import 'regenerator-runtime/runtime'

import chalk from 'chalk'
import ora from 'ora'

import {
  createDirectory,
  createTemplateApplication,
  displayTitle,
  formatAppName,
  installDevDependencies,
  installDependencies,
  npmInitDirectory,
  promptAppName
} from './util'

const main = async () => {
  try {
    await displayTitle()

    const appName = await promptAppName()

    const editedAppName = formatAppName(appName)

    // * Create a directory inside this directory with the application name (name trimmed)
    const createDirectorySpinner = ora('Creating application directory').start()
    const dir = await createDirectory(editedAppName).catch(e => {
      createDirectorySpinner.fail()
      console.log(chalk.redBright(e))
      process.exit(1)
    })
    createDirectorySpinner.succeed()

    // * NPM Init inside new directory
    const initDirectorySpinner = ora('Initializing application directory').start()
    await npmInitDirectory(dir).catch(e => {
      initDirectorySpinner.fail()
      console.log(chalk.redBright(e))
      process.exit(1)
    })
    initDirectorySpinner.succeed()

    // * Install Dependencies
    const installDependecniesSpinner = ora('Installing dependencies').start()
    await installDependencies(dir).catch(e => {
      installDependecniesSpinner.fail()
      console.log(chalk.redBright(e))
      process.exit(1)
    })
    installDependecniesSpinner.succeed()

    // * Install Dev Dependencies
    const installDevDependenciesSpinner = ora('Installing development dependencies').start()
    await installDevDependencies(dir).catch(e => {
      installDevDependenciesSpinner.fail()
      console.log(chalk.redBright(e))
      process.exit(1)
    })
    installDevDependenciesSpinner.succeed()

    // * Create template application
    const createTemplateApplicationSpinner = ora('Creating template application').start()
    await createTemplateApplication(dir).catch(e => {
      createTemplateApplicationSpinner.fail()
      console.log(chalk.redBright(e))
      process.exit(1)
    })
    createTemplateApplicationSpinner.succeed()
  } catch (e) {
    console.log(chalk.redBright(e))
  }
}

main()
