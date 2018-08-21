import React, { Component } from "react";
import ReactDOM from "react-dom";
import GoogleMapsLoader from "google-maps";
import "./Map.css";
import InfoWindow from "./InfoWindow";
import { GMAPS_API_KEY } from "./googleMaps";

GoogleMapsLoader.KEY = GMAPS_API_KEY;

const SF_CENTER = { lat: 37.7749295, lng: -122.4194155 };

const infowindowRoot = document.getElementById("infowindow-root");

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
//add map
 

  getMarker(position, title) {
    return title in this.state.markers
      ? this.state.markers[title]
      : this.createMarker(position, title);
  }
  //get marker position and title

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
  //create new marker

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
      if (marker && !marker.map) {
        marker.setMap(this.state.map);
      }
    }
  }

  highlightSelection() {
    if (!this.props.selection) {
      if (this.state.infowindow) {
        this.state.infowindow.close();
      }
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
    this.state.infowindow.open(this.state.map, matchingMarker);
  }

  componentDidMount() {
    GoogleMapsLoader.load(google => {
      if (!google) {
        this.props.reportError("Unable to load Google Maps");
        return;
      }
      this.setState({
        google,
        map: this.addMap(google),
        infowindow: new google.maps.InfoWindow({ content: infowindowRoot })
      });
      for (const place of this.props.locations) {
        this.getMarker(place.coordinates, place.name);
      }
    });
  }
//get marker coordinates and place name 
  componentDidUpdate() {
    this.removeMarkers();
    this.placeMarkers();
    this.highlightSelection();
  }

  render() {
    return (
      <div id="map" className="Map" ref={element => (this.mapNode = element)}>
        <p>Unable to load Google Maps.</p>
        <p>Please check your internet connection and try again.</p>
        <InfoWindow place={this.props.selection} />
      </div>
    );
  }
}

export default Map;