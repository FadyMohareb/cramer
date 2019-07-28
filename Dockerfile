FROM alpine:3.10
MAINTAINER m.anastasiadi@cranfield.ac.uk
RUN apk update && apk add nodejs npm build-base git curl curl-dev zlib-dev bzip2-dev xz-dev ncurses-dev
RUN wget https://github.com/samtools/htslib/releases/download/1.9/htslib-1.9.tar.bz2 && \
    tar xvjf htslib-1.9.tar.bz2 && cd htslib-1.9/ && \
    ./configure --prefix=/usr && make && make install && \
    cd .. && rm -rf htslib-1.9 htslib-1.9.tar.bz2
RUN wget https://github.com/samtools/bcftools/releases/download/1.9/bcftools-1.9.tar.bz2 && \
    tar xvjf bcftools-1.9.tar.bz2 && cd bcftools-1.9/ && \
    ./configure --prefix=/usr && make && make install && \
    cd .. && rm -rf bcftools-1.9 bcftools-1.9.tar.bz2
RUN wget https://github.com/samtools/samtools/releases/download/1.9/samtools-1.9.tar.bz2 && \
    tar xvjf samtools-1.9.tar.bz2 && cd samtools-1.9/ && \
    ./configure --prefix=/usr && make && make install && \
    cd .. && rm -rf samtools-1.9 samtools-1.9.tar.bz2
RUN git clone https://github.com/manastasiadi/libbeato.git && cd libbeato && \
    ./configure --prefix=/usr && make && make install && cd .. && rm -rf libbeato
RUN git clone https://github.com/CRG-Barcelona/bwtool.git && cd bwtool && \
    ./configure --prefix=/usr && make && make install && cd .. && rm -rf bwtool
RUN adduser -D app
ADD . /home/app
RUN chown -R app.app /home/app
USER app
WORKDIR /home/app
RUN npm install
CMD ["node", "bin/www"]