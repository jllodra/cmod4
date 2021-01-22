#!/bin/bash

export CXXFLAGS=" -s EXTRA_EXPORTED_RUNTIME_METHODS=['UTF8ToString','writeAsciiToMemory']"
export CFLAGS=" -s EXTRA_EXPORTED_RUNTIME_METHODS=['UTF8ToString','writeAsciiToMemory']"
export LDFLAGS=" -s EXTRA_EXPORTED_RUNTIME_METHODS=['UTF8ToString','writeAsciiToMemory']"

make CONFIG=emscripten EMSCRIPTEN_TARGET=audioworkletprocessor
