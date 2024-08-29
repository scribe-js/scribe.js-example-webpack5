# Overview
This example shows how [scribe.js](https://github.com/scribeocr/scribe.js) can be bundled with Webpack 5 into a web application.

# Instructions
To run this example locally, perform the following steps.
```sh
## Clone the repo
git clone https://github.com/scribeocr/scribe.js-example-webpack5.git
cd scribe.js-example-webpack5

## Install the dependencies
npm install

## Run Webpack
npm run build

## Start a server in the root directory
npm start
```
After the server is running, visit the web page indicated, and you will be able to extract text from an image or PDF.

# Webpack Discussion
### What non-default configurations are used?
The only non-default setting in the [webpack.config.js](./webpack.config.js) file is using `DefinePlugin` to set the 2 values.  First, `process` is set to `undefined` to force only the browser implementations of certain functions (and not Node.js implementations) to be included.  Scribe.js uses the condition `typeof process === 'undefined'` to check the current environment, and Webpack will not evaluate this condition as `true` during the build step unless the value of `process` is set explicitly.  

Second, `DISABLE_DOCX_XLSX` is defined, which disables the `.docx` and `.xlsx` output formats.  These formats are rarely used and still officially experimental, and due to their use of the zip.js package (which does not play nicely with Webpack) including them currently breaks the build.

### Is Webpack 4 supported?
No.  Scribe.js uses web workers for nearly everything, and support for Web Workers [was added in Webpack 5](https://webpack.js.org/guides/web-workers/).  While Webpack 4 does have a [worker-loader](https://github.com/webpack-contrib/worker-loader) plugin, it appears to require using a special syntax for creating workers that *only* runs with Webpack (and not natively in browsers), which is out of the question.  If you are a Webpack 4 user who gets a build working with Scribe.js, please submit a PR and we will add it to the list.

### Why does this build produce many files?
Running this build produces many files, which may be unexpected since some basic Webpack builds only produce a single `bundle.min.js` files.  There are several reasons for this, however rest assured, all files are never loaded by a single user.

#### Lazy Loading
Scribe.js only loads large resources when (1) explicitly requested using the `scribe.init` function or (2) required to perform a requested operation.  For example, the resources required to read PDFs are only loaded when setting `pdf: true` in the `scribe.init` options or when encountering a `.pdf` file.  If an application is only used to recognize `.png` or `.jpeg` files, that resources is never loaded.  Every lazily-loaded resource ends up in its own file.

#### Multiple Versions of Files
Similarly, Scribe.js loads different versions of the same file to save space.  For example, when recognizing documents in English, Scribe.js loads fonts that only contain Latin script to save space.

#### Web Workers for Parallel Processing
Scribe.js performs virtually all computationally-expensive operations in web workers.  In addition to improving performance on multi-core systems, this frees up the main process, which results in a more responsive UI.  Webpack puts the code for each worker in one or more separate files.

#### Resource Files
All files used by Scribe.js are included in the build.  This results in many font files (`.woff` or `.tff`) in the `dist` directory.  It would be possible to modify Scribe.js so these are hosted on a CDN by default; feel free to open a Git Issue if this is something that matters to you.
