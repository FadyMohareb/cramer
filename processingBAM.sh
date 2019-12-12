#!/bin/bash
clear

echo "CRAMER BAM and BIGWIG pre-processing script." 
echo ""
echo "Caution: This script is to be executed in the folder you wish to have your output files. The input file is not required to be in this folder, but must be added as an argument. The script works with any genomic BAM however for successful display the chromosome numbers and names must be at the end of each header (for example SL2.50ch01 is compatible but ch01SL2.50 is not)."
echo ""
if [ -z "$1" ];
 then  
  echo "Correct usage requires the input filename as an argument"
else
  File=$1
  read -p "What name would you like for the final files? (don't include whitespaces): " answerName
  echo ""
  read -p "The name of the BAM file that will be processed for viewing is '$File'. Do you also wish a BIGWIG file to view read density? (Answer Yes/No): " answerBIGWIG

while [ "$answerBIGWIG" != "Yes" ] && [ "$answerBIGWIG" != "No" ];
  do
    read -p "Please answer Yes/No (Do you want a BIGWIG file): " answerBIGWIG
done

clear

samtools view -H $File |grep @SQ > chrom.sizes

sed -i --regexp-extended 's/@SQ\tSN://g' chrom.sizes

sed -i --regexp-extended 's/LN://g' chrom.sizes



echo "Sorting the BAM"
echo ""
samtools sort  $File $answerName
echo "Finished sorting, creating BAI"
echo ""
samtools index $answerName.bam

echo "BAI created, you can now view the BAM file in  CRAMER"
echo ""
if [ $answerBIGWIG == "Yes" ];then
  echo "Beginning BIGWIG generation by making a WIG"
  echo ""
  java -jar ~/jvarkit/dist/bam2wig.jar $answerName.bam -w 1 -s 1 > $answerName.wig
  echo "Finished WIG, creating BIGWIG"
  echo ""
  wigToBigWig $answerName.wig chrom.sizes $answerName.bw -clip
fi
  echo "Your files are processed"

fi

