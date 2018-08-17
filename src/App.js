import React, { Component } from "react";
import Map from "./Map";
import Sidebar from "./Sidebar";
import "./App.css";
import { markerNames } from "./locations";
import { flickrForLocation } from "./flickr";
import { geocode } from "./googleMaps";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      selected: null,
      filter: ""
    };

    this.updateFilter = this.updateFilter.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
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
        return geocode(name)
          .then(result => (newPlace.coordinates = result.geometry.location))
          .then(coordinates => flickrForLocation(coordinates))
          .then(url => (newPlace.photoUrl = url));
      })
    ).then(() => this.setState({ places }));
  }

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
          />
        </div>
      </div>
    );
  }
}

export default App;