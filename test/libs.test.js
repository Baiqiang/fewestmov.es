import test from 'ava'
import { MARKS, calcMarks } from '../libs'

test('Cancellation case 1', t => {
  t.deepEqual(calcMarks(
    "R D R2 F D F' D B2 U D2", "U L U' L F2 R' D R F2 L2",
    ),[
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  )
})
test('Cancellation case 2', t => {
  t.deepEqual(calcMarks(
     "F2 R2 U L2", "R L' B2 R' L U2"
    ),[
      [0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0]
    ]
  )
})
test('Cancellation case 3', t => {
  t.deepEqual(calcMarks(
     "L2 U L2 U'", "U L2 U2"
    ),[
      [0, 1, 2, 2],
      [2, 2, 1]
    ]
  )
})
test('Cancellation case 4', t => {
  t.deepEqual(calcMarks(
   "R L' B2 R' L U2",  "U' R2 U' B"
    ),[
      [0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0]
    ]
  )
})
test('Cancellation case 5', t => {
  t.deepEqual(calcMarks(
    "R L'", "R L2",
    ),[
      [1, 1],
      [1, 1],
    ]
  )
})
test('Cancellation case 6', t => {
  t.deepEqual(calcMarks(
    "F R' L'", "R L2 F'",
    ),[
      [0, 2, 1],
      [2, 1, 0],
    ]
  )
})
test('Cancellation case 7', t => {
  t.deepEqual(calcMarks(
    "R' L F B' U' D R' L z' y", "U D' F' B R L'"
    ),[
      [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
      [2, 2, 2, 2, 2, 2]
    ]
  )
})
test('Cancellation case 8', t => {
  t.deepEqual(calcMarks(
    "L F R' F' R L' U R U' R'", "R U R' U' R' F R F'"
    ),[
      [0, 0, 0, 0, 2, 0, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 0, 0, 0]
    ]
  )
})
test('Cancellation case 9', t => {
  t.deepEqual(calcMarks(
    "U' L' U", "U L F'"
    ),[
      [0, 0, 1],
      [1, 0, 0]
    ]
  )
})
