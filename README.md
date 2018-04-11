# GENOVERSE-C3PO

Based on [Genoverse](https://github.com/wtsi-web/Genoverse), this is a portable, customizable, back-end independent JavaScript and HTML5 based genome browser which allows the user to explore data interactively.

Data is visualized in the browser, meaning Genoverse can be installed on any website and show data from a wide range of online, ftp links or local sources.
Genoverse works with a variety of formats, such as XML, JSON, BED, VCF, GFF, GFF3, BAM or delimited text files, and can be customized to parse and display any data source as required.

The authorised users can create a browser instance and add it in the database. In this way, on the welcome page any user can choose which one to visualize.
This browser instance, it is possible to select which plugins to display, the name, the description, the chromosome and the range to display and the tracks. In the tracks several choices are available with different kind of data like from Ensembl or ftp links.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

**Genoverse-C3PO requires to run on Linux.**
Genoverse-C3PO requires NodeJS  and two commonly used bioinformatics programs.
 - [NodeJS](https://nodejs.org/en/download/) v7.x
 - [Samtools](http://www.htslib.org/download/)
 - [Tabix]()
 
 Make sure that Samtools and Tabix are installed in /usr/bin/.

### Installing

Genoverse-C3PO has been tested on Linux 16.04.

Clone the Github repository:
```
$ git clone https://github.com/PierBJX/Genoverse-C3PO.git
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


## Versioning

?????

## Authors

* **Pierre Biojoux** - *Initial work* - [GitHub](https://github.com/PierBJX)
* **Josephine Burgin** - *Initial work* - [GitHub](https://github.com/jb234)
* **Kevin De Castrp Cogle** - *Initial work* - [GitHub](https://github.com/MrKevinDC)
* **Sergio Llaneza Lago** - *Initial work* - [GitHub](https://github.com/Sergiollaneza)
* **Alisha Ahamed** - *Initial work* - 
* **Magdalena Scislak** - *Initial work* - [GitHub](https://github.com/rawwwrrish)
* **Raissa Muvunyi** - *Initial work* - [GitHub](https://github.com/rmuvun95)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the ??????? - see the ???????? file for details

## Acknowledgments

* Genoverse [Github Project](https://github.com/wtsi-web/Genoverse)
* Cranfield Genoverse

