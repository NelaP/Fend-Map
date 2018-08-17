import React, { Component } from "react";
import ReactDOM from "react-dom";

const infowindowRoot = document.getElementById("infowindow-root");

class InfoWindow extends Component {
  render() {
    return ReactDOM.createPortal(
      <div>
        {this.props.place ? (
          <div>
            <h3>{this.props.place.name}</h3>
            {this.props.place.photo ? (
              <figure>
                <a href={this.props.place.photo.originalUrl} target="_blank">
                  <img
                    src={this.props.place.photo.photoUrl}
                    alt={`Flickr photo taken near ${this.props.place.name}`}
                  />
                </a>
                <figcaption>
                  Photo taken by Flickr user
                  {` "${this.props.place.photo.username}"`}.
                  <a href={this.props.place.photo.originalUrl} target="_blank">
                    See original
                  </a>.
                </figcaption>
              </figure>
            ) : null}
          </div>
        ) : null}
      </div>,
      infowindowRoot
    );
  }
}

export default InfoWindow;