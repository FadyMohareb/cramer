# Cranfield-Genoverse-2.0

Based on [Genoverse](https://github.com/wtsi-web/Genoverse), this is a portable, customizable, back-end independent JavaScript and HTML5 based genome browser which allows the user to explore data interactively.

Data is visualized in the browser, meaning Genoverse can be installed on any website and show data from a wide range of online, ftp links or local sources.
Genoverse works with a variety of formats, such as XML, JSON, BED, VCF, GFF, GFF3, BAM or delimited text files, and can be customized to parse and display any data source as required.

The authorised users can create a browser instance and add it in the database. In this way, on the welcome page any user can choose which one to visualize.
This browser instance, it is possible to select which plugins to display, the name, the description, the chromosome and the range to display and the tracks. In the tracks several choices are available with different kind of data like from Ensembl or ftp links.

## Quickstart/Demo

The easiest way to satisfy all dependencies and run Cranfield-Genoverse-2.0 is to build and run
the Docker image defined in Dockerfile within this repository.

This docker image assumes there is a MongoDB service running on localhost:27017

The easiest way to achieve this is to run: ```$ docker run --name mongo -p 27017:27017 -d mongo:latest```

or ```$ docker start mongo``` if you have already created the *mongo* container.

Clone this repository locally: ```$ git clone https://github.com/FadyMohareb/genoverse.git && cd genoverse```

To build: ```$ docker build . -t genoverse```

To run: ```$ docker run --rm --pid=host --network=host genoverse```

You may now visit [http://localhost:4000](http://localhost:4000) in your web browser.

To stop: Ctrl+C in the terminal window running the genoverse image.

To stop MongoDB: ```$ docker stop mongo```

## For development

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

**Genoverse-C3PO requires to run on Linux.**
Genoverse-C3PO requires NodeJS  and three commonly used bioinformatics programs.
 - [NodeJS](https://nodejs.org/en/download/) v7.x
 - [Samtools](http://www.htslib.org/download/)
 - [Bwtool](https://github.com/CRG-Barcelona/bwtool)
 - [kentUtils from UCSC](https://github.com/ENCODE-DCC/kentUtils)
 
 Make sure that they are installed in /usr/bin/.

### Installing

Genoverse-C3PO has been tested on Linux 16.04.

Clone the Github repository:
```
$ git clone https://github.com/PierBJX/Cranfield-Genoverse-2.0.git
```

To install, run the following commands:
```
$ cd <Genoverse/Directory>
$ npm install
$ node bin/www
```

The output should be:
```
Running at port: <port>
MangoDB connection open
```

Then, it could be accessible from any browser on any operating systems.
Open your browser and write this in the url address:
```
localhost:<port>
```
OR
```
IPaddress:<port>
```
Make sure the <port> value is the same than in the output displayed in the prompt command.
  
## Built With

* [NodeJS](https://nodejs.org/docs/latest-v7.x/api/) - The web framework used
* [Mangoose](http://mongoosejs.com/docs/api.html) - Database
* [Passport](http://www.passportjs.org/docs/) - Authentication

## Authors

* **Pierre Biojoux** - *Initial work* - [GitHub](https://github.com/PierBJX)
* **Josephine Burgin** - *Initial work* - [GitHub](https://github.com/jb234)
* **Kevin De Castrp Cogle** - *Initial work* - [GitHub](https://github.com/MrKevinDC)
* **Sergio Llaneza Lago** - *Initial work* - [GitHub](https://github.com/Sergiollaneza)
* **Alisha Ahamed** - *Initial work* - 
* **Magdalena Scislak** - *Initial work* - [GitHub](https://github.com/rawwwrrish)
* **Raissa Muvunyi** - *Initial work* - [GitHub](https://github.com/rmuvun95)


## Acknowledgments

* Genoverse [Github Project](https://github.com/wtsi-web/Genoverse)
* Cranfield Genoverse

