
kimpham54.github.io

1. pull down https://github.com/kimpham54/kimpham54.github.io
2. cd themes, git clone https://github.com/athul/archie.git or
`git submodule update --init --remote --merge`
3. localhost:1313, test with `hugo server -D`. add content, tweak away, test and build with `hugo -D` can remove public folder to rebuild cleanly,or
```
rm -rf resources
hugo server -D --disableFastRender --ignoreCache
```
4. git add, commit -m 'new thang', push origin master
5. github actions from .github/workflow/gh-pages.yml should deploy public/ in master automatically to gh-pages

notes:
- images need to go in /static not assets
- tags and dates need to be properly formatted for pages to build
- don't touch any content in themes, need to override

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
