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
            <li tabIndex="0" role="listitem"
              className={this.placeClass(place)}
              Key={place.name}
              onKeyPress={this.onKeyPress.bind(this)}
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

export default Sidebar;