import paper, { view } from "paper";
import { calcLeaf, drawLeaf } from "./leaf";
import * as dat from "dat.gui";

window.onload = function () {
  // Get a reference to the canvas object
  const canvas = document.getElementById("leaf");
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);

  let vars = {
    prc: 40,
    jd: 0.6,
    k1: 2,
    k2: 9,
    b1: -1,
    b2: 6,
    p1: 10,
    p2: 7,
    color: "green",
    stem_hgt_f: 0.3,
    leaf_wdt_f: 1.3,
    svg: function guiDownloadSVG() {
      downloadSVG();
    },
    png: function guiDownloadPNG() {
      downloadPNG();
    },
    randomize: function guiRandomize() {
      randomize();
    },
  };

  const gui = new dat.GUI();
  //
  gui
    .add(vars, "prc")
    .name("Dettaglio")
    .min(1)
    .max(100)
    .step(1)
    .onChange(function (newValue) {
      refresh();
    });
  //
  gui
    .add(vars, "stem_hgt_f")
    .name("Altezza gambo")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "leaf_wdt_f")
    .name("Larghezza foglia")
    .min(0)
    .max(3)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "jd")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "k1")
    .min(0)
    .max(30)
    .step(0.5)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "k2")
    .min(0)
    .max(30)
    .step(0.5)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "b1")
    .min(-30)
    .max(30)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "b2")
    .min(-30)
    .max(30)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "p1")
    .min(0)
    .max(20)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui
    .add(vars, "p2")
    .min(0)
    .max(20)
    .step(0.01)
    .onChange(function (newValue) {
      refresh();
    });
  gui.add(vars, "svg").name("↓ SVG");
  gui.add(vars, "png").name("↓ PNG");
  gui.add(vars, "randomize").name("Randomizza!");

  function refresh() {
    paper.project.clear();

    const leaf_hgt = paper.view.size.height / 3;
    const leaf_wdt = leaf_hgt * vars.leaf_wdt_f;
    const stem_hgt = leaf_hgt * vars.stem_hgt_f;
    const leaf_x = paper.view.size.width / 2;
    const leaf_y = (paper.view.size.height - leaf_hgt) / 2;

    const leaf = calcLeaf(
      vars.prc,
      vars.jd,
      vars.k1,
      vars.k2,
      vars.b1,
      vars.b2,
      vars.p1,
      vars.p2
    );
    drawLeaf(
      leaf,
      leaf_x,
      leaf_y,
      leaf_wdt,
      leaf_hgt - stem_hgt,
      stem_hgt,
      vars.color
    );
  }

  // Draw the view now:
  refresh();
  // randomize();

  paper.view.onResize = function () {
    refresh();
  };

  window.addEventListener("resize", function (event) {
    refresh();
  });

  // Download
  function downloadSVG() {
    let svgData: any = paper.project.exportSVG(); // Use any when stuff is not recognized
    svgData.outerHTML; // So now we can use outerHTML even if not recognized by typescript
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData.outerHTML], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const name = getname() + ".svg";
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    downloadLink.click();
  }

  function downloadPNG() {
    const imgData = canvas.toDataURL();
    const name = getname() + ".png";
    const downloadLink = document.createElement("a");
    downloadLink.href = imgData;
    downloadLink.download = name;
    downloadLink.click();
  }

  function randomize() {
    console.log(gui);
    gui.__controllers.forEach((control) => {
      if (control.constructor.name == "NumberControllerSlider") {
        const max = control.__max;
        const min = control.__min;
        const val = min + (max - min) * Math.random();
        control.setValue(val);
        //
        getname();
      }
    });
  }

  function getname() {
    let name = "";
    gui.__controllers.forEach((control) => {
      if (control.constructor.name == "NumberControllerSlider") {
        name += control.property + "=" + control.object[control.property] + "_";
      }
    });
    return name;
  }
};
