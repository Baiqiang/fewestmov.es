import { readdirSync } from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import config from 'config'

const models = {}

const sequelize = new Sequelize(config.get('db'))
sequelize.Model = Sequelize.Model

const modelsDir = path.join(__dirname, 'models')

readdirSync(modelsDir)
  .filter(file => file.indexOf('.') !== 0)
  .forEach(file => {
    const model = sequelize.import(path.join(modelsDir, file))
    models[model.name] = model
  })

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
});

models.sequelize = sequelize
models.Sequelize = Sequelize

export default models
