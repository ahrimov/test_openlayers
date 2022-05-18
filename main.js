import './style.css';
import {Map, View} from 'ol';
import KML from 'ol/format/KML';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import Projection from 'ol/proj/Projection';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';

import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

const raster = new TileLayer({
  source: new OSM(),
});

// Your loctations
var locations = [[59.925390, 30.411536], [59.925846, 30.412892], [59.926612, 30.412024], [59.926985, 30.413441], [59.928523, 30.411918] ];

locations.map(function(l) {
  return l.reverse();
});

var polyline = new LineString(locations);
polyline.transform('EPSG:4326', 'EPSG:3857');

var point = new Point([30.411536, 59.925390]);
point.transform('EPSG:4326', 'EPSG:3857');

var featurePoint = new Feature(point);
var featureLine = new Feature(polyline);
const vectorSource = new VectorSource();
vectorSource.addFeature(featurePoint);
vectorSource.addFeature(featureLine);

const vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      color: '#f51818',
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#f51818',
      }),
    }),
  }),
});


const map = new Map({
  target: 'map',
  layers: [raster, vector],
  view: new View({
    center: fromLonLat([30.4117405, 59.9255611]),
    projection: 'EPSG:3857',
    zoom: 15,
  }),
});

var showLayer = true;
function changeLayers(){
  showLayer = !showLayer;
  vector.setVisible(showLayer);
}

function GetKMLFromFeatures(features) {
    var format = new KML({
        'maxDepth':10,
        'extractStyles':true,
        'internalProjection': map.getView().getProjection(),
        'externalProjection': new Projection("EPSG:4326")
    });

    return format.writeFeatures(features);
}

function save(){
  download('test.txt', GetKMLFromFeatures([featureLine, featurePoint]));
}

document.getElementById("layers").addEventListener("click", changeLayers, false);
document.getElementById("save").addEventListener("click", save, false);


function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}



