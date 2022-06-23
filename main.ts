type Vector = Array<number>
type Base = Array<Vector>

const dot = (vector1: Vector, vector2: Vector): number => {
  let res = 0
  vector1.forEach((coordinate, index) => {
    res += coordinate * vector2[index]
  })
  return res
}

const multiply = (value: number, vector: Vector): Vector => {
  return vector.map(coordinate => value * coordinate)
}

const normalize = (vector: Vector): Vector => {
  let norm = dot(vector, vector)
  norm = Math.sqrt(norm)
  return vector.map(coordinate => coordinate / norm)
}

const diff = (vector1: Vector, vector2: Vector): Vector => {
  return vector1.map((coordinate, index) => coordinate - vector2[index])
}

const mu = (vector1: Vector, vector2: Vector): number => {
  return dot(vector1, vector2) / dot(vector2, vector2)
}

const gram_schmidt = (basis: Base): Base => {
  let base = [...basis]
  let n = base.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      let t = mu(base[i], base[j])
      base[i] = diff(base[i], multiply(t, base[j]))
    }
  }
  return base
}

const lll = (base: Base, delta: number): Base => {
  const n = base.length
  let ortho = gram_schmidt(base)
  let k = 1
  while (k < n) {
    for (let j = k - 1; j >= 0; j--) {
      let mu_kj = mu(base[k], ortho[j])
      if (Math.abs(mu_kj) > 0.5) {
        base[k] = diff(base[k], multiply(Math.round(mu_kj), base[j]))
        ortho = gram_schmidt(base)
      }
    }
    let mu_kk = mu(base[k], ortho[k - 1])
    if (dot(ortho[k], ortho[k]) >= ((delta - (mu_kk * mu_kk)) * dot(ortho[k - 1], ortho[k - 1]))) {
      k += 1
    } else {
      [base[k], base[k - 1]] = [base[k - 1], base[k]]
      ortho = gram_schmidt(base)
      k = Math.max(k - 1, 1)
    }
  }
  return base
}

console.log(lll([[1, 1, 1], [-1, 0, 2], [3, 5, 6]], 0.75))
console.log(lll([[1, 0, 0, 1345], [0, 1, 0, 35], [0, 0, 1, 154]], 0.75))