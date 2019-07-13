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
  const perPage = 3
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
  return {
    limit: perPage,
    offset: (page - 1) * perPage,
  }
}
