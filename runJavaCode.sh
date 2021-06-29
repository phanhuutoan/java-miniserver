#!/bin/bash
ls ${1}

if [[ ${?} -ne 0 ]] 
then
  echo "USAGE: ${0} [DIR_NAME] [CLASS_NAME]"
  exit 1
fi  

PATH_FILE="${1}/${2}"

javac "$PATH_FILE.java"

if [[ ${?} -ne 0 ]]
then 
  exit 1
fi

cd ${1}

java ${2}