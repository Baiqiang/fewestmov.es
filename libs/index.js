import { Algorithm } from 'insertionfinder'

export function formatAlgorithm(string) {
  // remove comments
  string = string.split('\n').map(s => s.split('//')[0]).join('')
  const algorithm = new Algorithm(string)
  algorithm.clearFlags()
  algorithm.normalize()
  return algorithm.toString()
}

export function getPagination(total, page) {
  const perPage = 50
  page = parseInt(page)
  if (Number.isNaN(page)) {
    page = 1
  }
  if (page < 1) {
    page = 1
  }
  if (page > Math.ceil(total / perPage)) {
    page = Math.ceil(total / perPage)
  }
  const offset = (page - 1) * perPage
  if (offset < 0) {
    offset = 0
  }
  return {
    limit: perPage,
    offset: offset,
  }
}
