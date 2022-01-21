import Navigation from './components/Navigation/Navigation.js'
import Logo from './components/Logo/Logo.js'
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import Rank from './components/Rank/Rank.js'
import Particles from "react-tsparticles";
import React, { Component } from 'react'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'

const app = new Clarifai.App({
  apiKey: '60f15fbfb5d44ca0980ffef977dff810'
})


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      ifSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })


  }

  componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log)
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box => {
    console.log(box);
    this.setState({ box: box })
  })

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
        }

        this.displayFaceBox(this.calculateFaceLocation(response))
      })

      .catch(err => console.log(err))

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ ifSignedIn: false })
    } else if (route === 'home') {
      this.setState({ ifSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    return (

      <div className="App">
        <Particles className='particles'
          id="tsparticles"
          options={{
            fpsLimit: 60,
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: false,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 0.5,
                straight: false,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              }
            },
            detectRetina: true,
          }}
        />



        <Navigation ifSignedIn={this.state.ifSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>

          : (
            this.state.route === 'signin' || this.state.route === 'signout'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )






        }
      </div>
    );
  }

}

export default App;
