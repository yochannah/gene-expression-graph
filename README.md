## About
Starter recipe for building with:

* gulp
* browserify / watchify
* less
* html/text templates using gulp-stringify

And live-reloading pages served via browsersync.

### Running the project

If you want to modify the script and let Browsersync live-reload your changes, run:

    $ gulp dev

If you just want a one-off build, gulp's default task will do it:

    $ gulp

Both tasks will compile your less (make sure to prefix partials with `_`, e.g. `_button.less`) and bundle up your js, then move it to the dist folder.

#### Testing

Run `$ mocha` (to run the suite once) or `$ mocha --watch` (to re-test when you make changes).
