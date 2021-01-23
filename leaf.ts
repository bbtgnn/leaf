import round from "./round";
import paper from "paper";

function calcLeaf(
  prc: number,
  jd: number,
  k1: number,
  k2: number,
  b1: number,
  b2: number,
  p1: number,
  p2: number
): Array<Array<Array<number>>> {
  const ROUNDING: number = 3;

  // List will store points on the contour
  const pts_cnt: Array<Array<number>> = [];
  // List will store points on the midrib
  const pts_mid: Array<Array<number>> = [];

  // Iterating
  for (let i = 0; i < prc; i++) {
    const j: number = (1 / (prc - 1)) * i;

    // Appending midrib
    pts_mid.push([round(j, ROUNDING), 0]);

    // Calculating glj and sj
    let glj: number;
    let sj: number;
    if (0 <= j && j <= jd) {
      glj = 1 - Math.pow((jd - j) / jd, k1);
      sj = -b1 * Math.pow((jd - j) / jd, p1);
    } else if (jd <= j && j <= 1) {
      glj = 1 - Math.pow((j - jd) / (1 - jd), k2);
      sj = b2 * Math.pow((j - jd) / (1 - jd), p2);
    }

    // Calculating contour point
    const xj: number = j + sj * (glj / Math.sqrt(1 + Math.pow(sj, 2)));
    const yj: number = glj / Math.sqrt(1 + Math.pow(sj, 2));

    // Appending contour point
    pts_cnt.push([round(xj, ROUNDING), round(yj, ROUNDING)]);
  }

  return [pts_cnt, pts_mid];
}

function drawLeaf(
  leafPts: Array<Array<Array<number>>>,
  x: number,
  y: number,
  w: number,
  h: number,
  sh: number,
  color: any
) {
  const leafGroup = new paper.Group();

  // Contour path left
  const cnt_path_lft: paper.Path = new paper.Path();
  for (let i = 0; i < leafPts[0].length; i++) {
    const cnt_pnt = new paper.Point(leafPts[0][i][0], leafPts[0][i][1]);
    if (i == 0) {
      cnt_path_lft.moveTo(cnt_pnt);
    } else {
      cnt_path_lft.lineTo(cnt_pnt);
    }
    // Drawing rib
    const rib = new paper.Path.Line(cnt_pnt, new paper.Point(leafPts[1][i]));
    leafGroup.addChild(rib);
  }

  // Contour path right
  const cnt_path_rgt: paper.Path = new paper.Path();
  for (let i = 0; i < leafPts[0].length; i++) {
    const cnt_pnt = new paper.Point(leafPts[0][i][0], -leafPts[0][i][1]);
    if (i == 0) {
      cnt_path_rgt.moveTo(cnt_pnt);
    } else {
      cnt_path_rgt.lineTo(cnt_pnt);
    }
    // Drawing rib
    const rib = new paper.Path.Line(cnt_pnt, new paper.Point(leafPts[1][i]));
    leafGroup.addChild(rib);
  }

  leafGroup.addChildren([cnt_path_lft, cnt_path_rgt]);

  leafGroup.strokeColor = color;
  leafGroup.scale(h, w / 2, new paper.Point(0, 0));
  leafGroup.rotate(-90, new paper.Point(0, 0));
  leafGroup.translate(new paper.Point(0, h));
  leafGroup.translate(new paper.Point(x, y));

  // Drawing central line
  const rib_cnt = new paper.Path();
  rib_cnt.moveTo(new paper.Point(x, y));
  rib_cnt.lineBy(new paper.Point(0, h));
  rib_cnt.strokeColor = color;

  // Drawing stem
  const stem = new paper.Path();
  stem.moveTo(new paper.Point(x, y + h));
  stem.lineBy(new paper.Point(0, sh));
  stem.strokeColor = color;
}

export { calcLeaf, drawLeaf };
