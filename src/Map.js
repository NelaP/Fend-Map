import React, { Component } from "react";
import ReactDOM from "react-dom";
import GoogleMapsLoader from "google-maps";
import "./Map.css";
import { GMAPS_API_KEY } from "./googleMaps";

GoogleMapsLoader.KEY = GMAPS_API_KEY;

const SF_CENTER = { lat: 37.7749295, lng: -122.4194155 };

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: {},
      infowindow: null
    };

    this.onClick = this.onClick.bind(this);
  }

  addMap(google) {
    const mapNode = ReactDOM.findDOMNode(this.mapNode);
    const options = { zoom: 12, center: SF_CENTER };
    return new google.maps.Map(mapNode, options);
  }

  onClick(event) {
    const itemName = event.Ga.target.title;
    this.props.onselect(itemName);
  }

  getMarker(position, title) {
    return title in this.state.markers
      ? this.state.markers[title]
      : this.createMarker(position, title);
  }

  createMarker(position, title) {
    if (!this.state.hasOwnProperty("google")) {
      return null;
    }
    const marker = new this.state.google.maps.Marker({ position, title });
    this.setState(prevState => {
      prevState.markers[title] = marker;
      return prevState;
    });
    marker.addListener("click", this.onClick);
    return marker;
  }

  removeMarkers() {
    for (const [name, marker] of Object.entries(this.state.markers)) {
      if (!this.props.locations.some(place => place.name === name)) {
        marker.setMap(null);
      }
      if (this.props.selection && this.props.selection.name !== name) {
        marker.setAnimation(null);
      }
    }
  }

  placeMarkers() {
    for (const place of this.props.locations) {
      const marker = this.getMarker(place.coordinates, place.name);
      if (!marker.map) {
        marker.setMap(this.state.map);
      }
    }
  }

  highlightSelection() {
    if (!this.props.selection) {
      return;
    }
    const matchingMarker = this.getMarker(
      this.props.selection.coordinates,
      this.props.selection.name
    );
    if (!matchingMarker) {
      return;
    }
    matchingMarker.setAnimation(this.state.google.maps.Animation.BOUNCE);
    this.state.infowindow.setContent(this.infowindowContent(this.props.selection));
    this.state.infowindow.open(this.state.map, matchingMarker);
  }

  infowindowContent(place) {
    return `<h3>${place.name}</h3><br/>${place.photoUrl}`;
  }

  componentDidMount() {
    GoogleMapsLoader.load(google => {
      this.setState({
        google,
        map: this.addMap(google),
        infowindow: new google.maps.InfoWindow()
      });
      for (const place of this.props.locations) {
        this.getMarker(place.coordinates, place.name);
      }
    });
  }

  componentDidUpdate() {
    this.removeMarkers();
    this.placeMarkers();
    this.highlightSelection();
  }

  render() {
    return (
      <div id="map" className="Map" ref={element => (this.mapNode = element)}>
        Map loading...
      </div>
    );
  }
}

export default Map;