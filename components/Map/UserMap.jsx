// Draws editable rectangular regions over an image using Leaflet + the
// leaflet-draw plugin, backed by Backbone-style models
// (map.get('image'), mapRegions.each/.on/.off, region.get(...)).
//
// NOT wired into this library's index.js: 'leaflet' and 'leaflet-draw'
// aren't dependencies here, and the model layer doesn't exist in this
// repo. Kept for reference/future rewrite against a real data layer.
// Unrelated to Map/Map.jsx (a Google Maps address-search component,
// which is the maintained map component in this library).
import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import Loader from '../Loader';

// By default the tooltip shows area in hectares; this shows
// "Release mouse to finish drawing" instead.
L.Draw.Rectangle = L.Draw.Rectangle.extend({
  _getTooltipText: L.Draw.SimpleShape.prototype._getTooltipText
});

const regionStyle = {
  weight: 2,
  color: '#439fd8',
  opacity: 1,
  fillOpacity: 0.7,
  fillColor: '#439fd8'
};

const UserMap = ({ map, mapRegions, isEditing, isAdding, className, onRegionCreate, onRegionUpdate, onRegionDelete, onRegionClick, onMapLoad }) => {
  const mapEl = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const leafletMap = useRef(null);
  const leafletRegions = useRef(null);
  const drawControl = useRef(null);
  const imageSize = useRef({ width: null, height: null });

  const getRegionAttributesFromLayer = useCallback((layer) => {
    const zoom = leafletMap.current.getMaxZoom() - 1;
    const northWest = leafletMap.current.project(layer.getBounds().getNorthWest(), zoom);
    const southEast = leafletMap.current.project(layer.getBounds().getSouthEast(), zoom);
    return {
      relativeX: northWest.x,
      relativeY: northWest.y,
      relativeWidth: southEast.x - northWest.x,
      relativeHeight: southEast.y - northWest.y
    };
  }, []);

  const bindLabel = useCallback((layer, region) => {
    if (region.get('location')) {
      layer.bindLabel(region.get('location').get('name'));
    } else {
      layer.bindLabel('Click to attach this region to a location.');
    }
  }, []);

  const addRegion = useCallback((region) => {
    const zoom = leafletMap.current.getMaxZoom() - 1;
    const southWestOffset = [region.get('relativeX'), region.get('relativeY') + region.get('relativeHeight')];
    const northEastOffset = [region.get('relativeX') + region.get('relativeWidth'), region.get('relativeY')];
    const southWestCoords = leafletMap.current.unproject(southWestOffset, zoom);
    const northEastCoords = leafletMap.current.unproject(northEastOffset, zoom);
    const bounds = new L.LatLngBounds(southWestCoords, northEastCoords);

    const layer = new L.Rectangle(bounds, regionStyle).addTo(leafletRegions.current);

    bindLabel(layer, region);
    region.on('change:location', () => bindLabel(layer, region));

    layer.on('click', () => onRegionClick(region, layer, leafletMap.current));
    layer.uuid = region.get('uuid');
  }, [bindLabel, onRegionClick]);

  const removeRegion = useCallback((region) => {
    leafletRegions.current.eachLayer((layer) => {
      if (layer.uuid === region.get('uuid')) leafletRegions.current.removeLayer(layer);
    });
  }, []);

  const loadMap = useCallback(() => {
    setImageLoaded(true);

    leafletMap.current = L.map(mapEl.current, { minZoom: 1, maxZoom: 4, crs: L.CRS.Simple });
    leafletMap.current.on('load', onMapLoad);
    leafletMap.current.setView(new L.LatLng(0, 0), 3); // zoom 3 is 100% image scaling

    const zoom = leafletMap.current.getMaxZoom() - 1;
    const southWest = leafletMap.current.unproject([0, imageSize.current.height], zoom);
    const northEast = leafletMap.current.unproject([imageSize.current.width, 0], zoom);
    const bounds = new L.LatLngBounds(southWest, northEast);

    L.imageOverlay(map.get('image'), bounds).addTo(leafletMap.current);
    leafletMap.current.setMaxBounds(bounds);

    leafletRegions.current = new L.FeatureGroup();

    drawControl.current = new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: false,
        circle: false,
        marker: false,
        rectangle: { shapeOptions: regionStyle }
      },
      edit: {
        featureGroup: leafletRegions.current,
        edit: { selectedPathOptions: { weight: 2, color: '#ffffff', opacity: 1, fillOpacity: 0.7, fillColor: '#439fd8' } }
      }
    });

    leafletMap.current.addLayer(leafletRegions.current);
    leafletMap.current.addControl(drawControl.current);

    mapRegions.each(addRegion);
    mapRegions.on('add', addRegion);
    mapRegions.on('remove', removeRegion);

    leafletMap.current.on('draw:created', (event) => {
      const layer = event.layer;
      layer.setStyle(regionStyle);
      onRegionCreate(getRegionAttributesFromLayer(layer));
    });

    leafletMap.current.on('draw:edited', (event) => {
      event.layers.eachLayer((layer) => {
        const attributes = getRegionAttributesFromLayer(layer);
        attributes.uuid = layer.uuid;
        onRegionUpdate(attributes);
      });
    });

    leafletMap.current.on('draw:deleted', (event) => {
      event.layers.eachLayer((layer) => {
        onRegionDelete(layer.uuid);
        leafletRegions.current.removeLayer(layer);
      });
    });
  }, [map, mapRegions, onMapLoad, onRegionCreate, onRegionUpdate, onRegionDelete, addRegion, removeRegion, getRegionAttributesFromLayer]);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      imageSize.current = { width: image.width, height: image.height };
      loadMap();
    };
    image.src = map.get('image');

    return () => {
      if (leafletMap.current) leafletMap.current.remove();
      mapRegions.each((region) => region.off('change:location'));
      mapRegions.off('add', addRegion);
      mapRegions.off('remove', removeRegion);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!drawControl.current) return;

    if (isEditing) {
      drawControl.current._toolbars.edit._modes.edit.handler.enable();
    } else {
      drawControl.current._toolbars.edit._modes.edit.handler.save();
      drawControl.current._toolbars.edit._modes.edit.handler.disable();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!drawControl.current) return;

    if (isAdding) drawControl.current._toolbars.draw._modes.rectangle.handler.enable();
    else drawControl.current._toolbars.draw._modes.rectangle.handler.disable();
  }, [isAdding]);

  return (
    <div className={className || ''} ref={mapEl}>
      {!imageLoaded && <Loader fullscreen />}
    </div>
  );
};

UserMap.propTypes = {
  onRegionCreate: PropTypes.func,
  onRegionUpdate: PropTypes.func,
  onRegionDelete: PropTypes.func,
  onRegionClick: PropTypes.func,
  onMapLoad: PropTypes.func,
  map: PropTypes.object.isRequired,
  mapRegions: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  isAdding: PropTypes.bool,
  className: PropTypes.string
};

UserMap.defaultProps = {
  onRegionCreate: () => {},
  onRegionUpdate: () => {},
  onRegionDelete: () => {},
  onRegionClick: () => {},
  onMapLoad: () => {},
  isEditing: false,
  isAdding: false
};

export default UserMap;
