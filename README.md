Web UI for Nagome
=================

UI plugin for [Nagome](https://github.com/diginatu/nagome).

This UI is made with [Onsen UI](https://onsen.io/) (Apache License).


How to use
----------

### Developing and Build

Install dependencies.

~~~ sh
npm install
~~~

This project is created by [create-react-app](https://github.com/facebookincubator/create-react-app).
So you can start developing running following command.

~~~ sh
npm start
~~~

Create an optimized production build.

~~~ sh
npm run build
~~~

To launch Nagome process and connect to it, you have to place an executable [here](https://github.com/diginatu/nagome-webapp_template/releases) in the same directory. 
It is recommended to name it `runserver` because it is written in `.gitignore`.
And execute it from the directory.

~~~ sh
./runserver
~~~

This UI app automatically connect to the process.
And then you can use this app now.

### Pre-build production

There are pre-build productions on the [releases page](https://github.com/diginatu/nagome-webui/releases).
These are assuming it is hosted at /app/.

These pre-build productions include [Onsen UI](https://onsen.io/) (Apache License).


Tasks
-----

* [] fix the size of user icon
