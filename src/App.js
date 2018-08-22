import React, { Component } from "react";
import Map from "./Map";
import Sidebar from "./Sidebar";
import Modal from "react-modal";
import "./App.css";
import { markerNames } from "./locations";
import { flickrForLocation } from "./flickr";
import { geocode } from "./googleMaps";

Modal.setAppElement("#app-root");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      selected: null,
      filter: "",
      errorMessage: null
    };

    this.updateFilter = this.updateFilter.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
    this.reportError = this.reportError.bind(this);
    this.closeErrorMessage = this.closeErrorMessage.bind(this);
  }

  reportError(message) {
    if (this.state.errorMessage != null) {
      // ignore additional errors
      return;
    }
    this.setState({ errorMessage: message });
  }

  closeErrorMessage() {
    this.setState({ errorMessage: null });
  }

  fetchLocationData() {
    if (this.state.places.length) {
      return;
    }
    const places = [];
    Promise.all(
      markerNames.map(name => {
        const newPlace = { name };
        places.push(newPlace);
        return geocode(name, this.reportError)
          .then(result => (newPlace.coordinates = result.geometry.location))
          .then(coordinates => flickrForLocation(coordinates, this.reportError))
          .then(photo => (newPlace.photo = photo))
          .catch(error => this.reportError("External API failure"));
      })
    ).then(() => this.setState({ places }));
  }
//get location data
  selectLocation(placeName) {
    const place = this.state.places.filter(place => place.name === placeName)[0];
    this.setState({ selected: place || null });
  }

  updateFilter(event) {
    this.setState({ filter: event.target.value });
    if (this.state.selected && !this.filterMatch(this.state.selected.name, event.target.value)) {
      this.setState({ selected: null });
    }
  }

  filterMatch(placeName, filter) {
    return placeName.toLowerCase().includes(filter.toLowerCase());
  }

  matchesFilter(place) {
    return !this.state.filter || this.filterMatch(place.name, this.state.filter);
  }

  placesMatchingFilter() {
    return this.state.places.filter(place => this.matchesFilter(place));
  }

  componentDidMount() {
    this.fetchLocationData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Flickr photos from SF</h1>
        </header>
        <div className="App-body">
          <Sidebar
            filtertext={this.state.filter}
            locations={this.placesMatchingFilter()}
            selection={this.state.selected}
            onchange={this.updateFilter}
            onselect={this.selectLocation}
          />
          <Map
            locations={this.placesMatchingFilter()}
            selection={this.state.selected}
            onselect={this.selectLocation}
            reportError={this.reportError}
          />
          <Modal isOpen={this.state.errorMessage !== null} contentLabel="Error notification">
            <h3>Sorry, something went wrong</h3>
            <p>Error: {this.state.errorMessage}</p>
            <p>There may be an issue with your internet connection.</p>
            <button onClick={this.closeErrorMessage}>Close</button>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;