// Features
//    -   Rata - Rata
//    -   Penghasilan Orang Tua
//    -   Tanggungan Orang Tua
//    -   Hafalan Alquran

type Row = number[];
type Matrix = Row[];

const delta = 0.000001;
const D = 2;
const K = 2;
const W = [1, 1];
const sum = (a: number, b: number) => a + b;

function randomCenter() {
  const centers = Array(D).fill(0).map((_, i) => Math.random() * W[i])
  return centers
}

function distance(x: Row, y: Row) {
  return Math.sqrt( x.map((xi, i) => Math.pow(xi - y[i], 2)).reduce(sum, 0) );
}

function almost_eq(x: number, y: number) {
  return Math.abs(x - y) < delta;
}

function center_eq(c1: Row, c2: Row) {
  return c1.every((c, i) => almost_eq(c, c2[i]));
}

function center(xs: Matrix) {
  let sums = Array(D).fill(0);
  const n = xs.length;
  xs.forEach(row => {
    row.forEach((x, i) => {
      sums[i] += x;
    })
  })
  return sums.map((x, i) => x / n);
}

export default function kmeans(items: any[]) {  
  const X = items.map(item => {
    return [
      item.rata as number,
      item.penghasilan_ortu as number
    ]
  })
  // console.log(X)
  // throw new Error('stop')

  // Normalize
  const im = 9999999999;
  let MAX = [-1, -1, -1, -1]
  let MIN = [im, im, im, im]
  X.forEach(row => {
    row.forEach((x, i) => {
      if (x > MAX[i]) {
        MAX[i] = x
      }
      if (x < MIN[i]) {
        MIN[i] = x
      }
    })
  })
  const X_normalized = X.map(row =>
    row.map((x, i) => x / MAX[i] * W[i])
  );

  // Initialize centers
  let centers = [
    randomCenter(),
    randomCenter()
  ];
  let counter = 0;
  while (true) {
    counter += 1;
    let clusters = [
      new Set<number>(),
      new Set<number>()
    ];
    X_normalized.map((row, ri) => {
      // Calculate distance to each centers
      const row_d_centers = centers.map(c => distance(c, row));
      const m = Math.min(...row_d_centers);
      const mi = row_d_centers.indexOf(m);
      // Cluster by minimum distance
      clusters[mi].add(ri);
    });

    const new_centers = clusters.map(indices => {
      const rows = Array.from(indices.values()).map(ri => X_normalized[ri]);
      const new_c = center(rows);
      return new_c
    });

    const not_changing = new_centers.every((nc, i) => center_eq(nc, centers[i]));
    if (not_changing) {
      return {
        clusters,
        centers,
        counter
      }
    } else {
      centers = [...new_centers];
    }
  }

}