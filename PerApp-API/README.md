<!-- basic doc for a rest api -->

# PerApp REST API

## Description

This is a basic REST API for image processing. It is built using the [Node.js](https://nodejs.org/en/) framework [Express](https://expressjs.com/).

## Installation

### Clone

- Clone this repo to your local machine using `git clone git@github.com:Mitrano-sensei/APP4_Persistance_Retinienne.git`
  
### Setup

> install npm packages

```shell

$ npm install

```

> run the server

```shell

$ node server.js

```

## Usage 

### Endpoints

- `POST /process` - process an image and return the processed image.

### Request Body Example

```json
{
  "source": "base64 encoded image",
  "type": "image type",
  "config": {
    "resize": {
      "width": 28,
      "height": 28
    },
    "contrast": 0.8,
    "brightness": 0.5,
    "grayscale": true,
    "toMatrix": true
  }
}

```

### To simplify API usage with React-Native

Consider exposing the API using [ngrok](https://ngrok.com/). This will allow you to use the API from your mobile device.

### Prerequisites

- [Node.js](https://nodejs.org/en/)