#!/usr/bin/env bash
emcc --bind  -s WASM=1 -s USE_PTHREADS=0 -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT="web" -s USE_BOOST_HEADERS=1 -o quick_example.js  cpp/src/*.cpp -I /usr/include/rapidjson --preload-file dormans-grammar.json
