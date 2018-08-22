<<<<<<< HEAD
import React, { Component } from "react";
import "./Sidebar.css";

class Sidebar extends Component {
  onClick(event) {
    const itemName = event.target.innerHTML;
    this.props.onselect(itemName);
  }

  placeClass(place) {
    let className = "Sidebar-place";
    if (place === this.props.selection) {
      className += " Sidebar-place-selected";
    }
    return className;
  }

  render() {
    return (
      <section className="Sidebar">
        <h3 className="Sidebar-title">Filter locations</h3>
        <input
          className="Sidebar-filtertext"
          id="filter"
          type="search"
          value={this.props.filtertext}
          onChange={this.props.onchange}
        />
        <ul  role= "list" className="Sidebar-place-list">
          {this.props.locations.map(place => (
            <li tabindex="0" role="listitem"
              className={this.placeClass(place)}
              onKeyPress={place.name}
              onClick={this.onClick.bind(this)}
            >
              {place.name}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

||||||| merged common ancestors
import React, { Component } from "react";
import "./Sidebar.css";

class Sidebar extends Component {
  onClick(event) {
    const itemName = event.target.innerHTML;
    this.props.onselect(itemName);
  }

  placeClass(place) {
    let className = "Sidebar-place";
    if (place === this.props.selection) {
      className += " Sidebar-place-selected";
    }
    return className;
  }

  render() {
    return (
      <section className="Sidebar">
        <h3 className="Sidebar-title">Filter locations</h3>
        <input
          className="Sidebar-filtertext"
          id="filter"
          type="search"
          value={this.props.filtertext}
          onChange={this.props.onchange}
        />
        <ul className="Sidebar-place-list">
          {this.props.locations.map(place => (
            <li
              className={this.placeClass(place)}
              key={place.name}
              onClick={this.onClick.bind(this)}
            >
              {place.name}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

=======
import React, { Component } from "react";
import "./Sidebar.css";

class Sidebar extends Component {
  onClick(event) {
    const itemName = event.target.innerHTML;
    this.props.onselect(itemName);
  }

  placeClass(place) {
    let className = "Sidebar-place";
    if (place === this.props.selection) {
      className += " Sidebar-place-selected";
    }
    return className;
  }

  render() {
    return (
      <section className="Sidebar">
        <h3 className="Sidebar-title">Filter locations</h3>
        <input
          className="Sidebar-filtertext"
          id="filter"
          type="search"
          value={this.props.filtertext}
          onChange={this.props.onchange}
        />
        <ul  role= "list" className="Sidebar-place-list">
          {this.props.locations.map(place => (
            <li tabindex="0" role="listitem"
              className={this.placeClass(place)}
              key={place.name}
              onClick={this.onClick.bind(this)}
            >
              {place.name}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

>>>>>>> 6264a6c85ed7cf504297fd4ce9ba4e189f6b4481
export default Sidebar;