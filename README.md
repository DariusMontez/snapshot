# Snapshot App

Snapshot is an live, interactive game in which teams stealthally snap photos of each other. The first team to capture a photo of all teams wins! The only equipment needed is a mobile phone with internet connection and a camera.

##Maintaining on Github Pages

Do not directly commit to the `gh-pages` branch; instead, use this command to update `gh-pages` from the master branch:

```
git subtree push --prefix public origin gh-pages
```

IF you accidentally commit to `gh-pages`, you can overwrite your changes forcefully:

```
git push origin `git subtree split --prefix public master`:gh-pages --force
```
