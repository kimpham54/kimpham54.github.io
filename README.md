
kimpham54.github.io

1. pull down https://github.com/kimpham54/kimpham54.github.io
2. add content, tweak away
3. git add, commit -m 'new thang', push origin master
4. github actions from .github/workflow/gh-pages.yml should deploy public/ in master automatically to gh-pages

kimpham54.github.io is dead. Long live kimpham54.github.io!

2022-08-17
A fresh new look as of August 2022 inspired by https://maxammann.org/ and the open transparent work of https://ashleyblewer.com/. Using the more frequently updated Archie theme (https://github.com/athul/archie), wanted to keep it simple without netlify, want to use Github Actions to build and load rather than have two repositories for deployment. Migrated all my content over.

- deploy workflow is in .github
- all config parameters are in config.toml
- override css in assets, override layouts in layouts

- unpublish site and republish github actions
- branches still called master not main
- untracked content with archie theme git submodule rm craziness
- oops forgot https https://github.com/athul/archie/issues/1
