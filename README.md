## About
Hack-ey js-specific version of [this gene expression graph](https://github.com/intermine/intermine/blob/beta/bio/webapp/src/org/intermine/bio/web/model/GeneExpressionAtlasTissuesExpressions.java).

Demo at http://yochannah.github.io/gene-expression-graph/

### Using the project
See index.html for a basic demo / init instructions.


### Running the project

If you want to modify the script and let Browsersync live-reload your changes, run:

    $ gulp dev

If you just want a one-off build, gulp's default task will do it:

    $ gulp

Both tasks will compile your less (make sure to prefix partials with `_`, e.g. `_button.less`) and bundle up your js, then move it to the dist folder.

#### Testing

Run `$ mocha` (to run the suite once) or `$ mocha --watch` (to re-test when you make changes).
