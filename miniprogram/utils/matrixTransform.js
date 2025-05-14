export function transformMatrix(matrix, step) {
  switch(step) {
    case 'E':
      return transformToA(matrix)
    case 'A':
      return transformToB(matrix)
    case 'B':
      return transformToC(matrix)
    case 'C':
      return transformToD(matrix)
    default:
      return matrix
  }
}

function transformToA(matrix) {
  // 实现 E -> A 的转换规则
  return matrix.map(row => [...row])
}

function transformToB(matrix) {
  // 实现 A -> B 的转换规则
  return matrix.map(row => [...row])
}

function transformToC(matrix) {
  // 实现 B -> C 的转换规则
  return matrix.map(row => [...row])
}

function transformToD(matrix) {
  // 实现 C -> D 的转换规则
  return matrix.map(row => [...row])
}
