module.exports = {
    entry: "./src/js/app.js", //file that webpack will read to create giant file w/ all of our js in it
    output: {
        path: `${__dirname}/dist`, //absolute path of the directory that contains the file that is currently executing (.resolve is from the require path)
        filename: 'bundle.js' //what we want the file to be called once we output
    },
    devtool: 'source-map', //helpful for debugging -- if we have an err in code, this will tell what line the err is on
    module: {
        rules: [
            { //we are saying here that for any jsx files we use babel loader
                test: /\.js$/, //a regular expression that tests what kind of files to run through this loader.
                exclude: /(node_modules|bower_components)/, //ignore these files
                use: {
                  loader: 'babel-loader', //the name of the loader we are going to use (babel-loader).
                  options: { // options for the loader
                    // for webpack 5, this 'query' key should be 'options' key instead
                    // for more info: https://webpack.js.org/configuration/module/#ruleoptions--rulequery
                    presets: ['@babel/preset-env'] //tells loader to use @babel/env which transpiles back to es5
                  }
                },
              },
              {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader',
                ],
                },
                {
                test: /\.(svg|gif|png|eot|woff|ttf)$/,
                use: [
                  'url-loader',
                ],
                },
        ]
    }
}