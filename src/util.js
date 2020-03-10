import boxen from 'boxen'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import ncp from 'ncp'

import { exec } from 'child_process'
import { mkdir, writeFile } from 'fs'
import { join } from 'path'

/**
 * Default style applied to Boxen.
 */
const defaultBoxenStyle = {
  borderColor: 'magentaBright',
  borderStyle: 'round',
  float: 'center',
  padding: { top: 0, bottom: 0, right: 1, left: 1 }
}

/**
 * Uses Figlet to transform your text to ASCII.
 * @param {String} txt Text to be figlet-itized.
 * @param {Object} options Options object.
 * @returns {Promise} Resolves with text.
 */
const figletPromise = (txt, options = {}) =>
  new Promise((resolve, reject) =>
    figlet.text(txt, options, (error, result) => {
      if (error) {
        return reject(error)
      }

      return resolve(result)
    })
  )

const displayTitle = () =>
  new Promise(async (resolve, reject) => {
    try {
      const text = await figletPromise('CLI Creator', { font: 'slant' })

      console.log(boxen(chalk.blueBright(text), defaultBoxenStyle))
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const promptAppName = () =>
  new Promise(async (resolve, reject) => {
    try {
      const { appName } = await inquirer.prompt([{ name: 'appName', type: 'input', message: 'Application Name?' }])
      resolve(appName)
    } catch (e) {
      reject(e)
    }
  })

const createDirectory = directoryName =>
  new Promise((resolve, reject) => {
    try {
      const dirPath = join(__dirname, `../${directoryName}`)
      mkdir(dirPath, err => {
        if (err) {
          return reject(err)
        }

        resolve(dirPath)
      })
    } catch (e) {
      reject(e)
    }
  })

const formatAppName = appName =>
  appName
    .toLowerCase()
    .trim()
    .replace(/ /, '-')

const execute = command =>
  new Promise((resolve, reject) => {
    try {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(error)
        }

        resolve(stdout)
      })
    } catch (e) {
      reject(e)
    }
  })

const npmInitDirectory = dir =>
  new Promise(async (resolve, reject) => {
    try {
      await execute(`cd ${dir} && npm init -y`)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const installDependencies = dir =>
  new Promise(async (resolve, reject) => {
    try {
      await execute(`cd ${dir} && npm install boxen chalk core-js figlet inquirer ora regenerator-runtime`)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const installDevDependencies = dir =>
  new Promise(async (resolve, reject) => {
    try {
      await execute(`cd ${dir} && npm install --save-dev @babel/cli @babel/core @babel/preset-env`)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const createFile = (path, data) =>
  new Promise((resolve, reject) => {
    try {
      writeFile(path, data, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    } catch (e) {
      reject(e)
    }
  })

const duplicateFiles = (src, dest) =>
  new Promise((resolve, reject) => {
    try {
      ncp(src, dest, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    } catch (e) {
      reject(e)
    }
  })

const createTemplateApplication = dir =>
  new Promise(async (resolve, reject) => {
    try {
      // * Add .babelrc
      await createFile(
        join(dir, '/.babelrc'),
        JSON.stringify({
          presets: ['@babel/preset-env']
        })
      )
      // * Add src directory
      await duplicateFiles(join(dir, '../application-src'), join(dir, '/src'))
      resolve()
    } catch (e) {
      reject(e)
    }
  })

module.exports = {
  createDirectory,
  createTemplateApplication,
  displayTitle,
  formatAppName,
  installDevDependencies,
  installDependencies,
  npmInitDirectory,
  promptAppName
}
