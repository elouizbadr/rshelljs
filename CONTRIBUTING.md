# Contributing to RShellJS

## Code Contributions

This section will guide you through the contribution process.

### Step 1: Fork

Fork the project [on GitHub](https://github.com/elouizbadr/rshelljs) and clone your fork locally.

```text
$ git clone git@github.com:username/rshelljs.git
$ cd rshelljs
$ git remote add upstream https://github.com/elouizbadr/rshelljs.git
```

#### Which branch?

When developing new features and bug fixes, the `master` branch should be pulled and built upon.

#### Dependencies

RShellJS has two main dependencies :

+ [ShellJS](https://github.com/shelljs/shelljs.git) for portable Unix shell commands for Node.js
+ [Socket.IO](https://github.com/socketio/socket.io.git) for realtime application Framework (Node.JS server).

Issues related to any of the dependencies above should reported to their respective projects. We do not accept patches to us.

### Step 2: Branch

Create a branch and start innovating:

```text
$ git checkout -b my-branch -t origin/master
```

### Step 3: Commit

Make sure git knows your name and email address:
```text
$ git config --global user.name "Your Name"
$ git config --global user.email "your.email@example.com"
```

Add and commit:

```text
$ git add my/changed/files
$ git commit
```

### Step 4: Rebase

Use `git rebase` (not `git merge`) to synchronize your work with the main repository.

```text
$ git fetch upstream
$ git rebase upstream/master
```

### Step 5: Test (Optional)

Bug fixes and features should - preferably - come with tests. Add your tests to `tests/` directory if you are unsure where to put them.

To run the tests on Unix / macOS:

```test
$ npm test
```

### Step 6: Push

```text
$ git push origin my-branch
```

Pull requests will be reviewed within a few days.

### Step 7: Discuss and update

You will probably get feedback or requests for changes to your Pull Request.
This is a big part of the submission process so don't be discouraged!

To make changes to an existing Pull Request, make the changes to your branch.
When you push that branch to your fork, GitHub will automatically update the Pull Request.

You can push more commits to your branch:

```test
$ git add my/changed/files
$ git commit
$ git push origin my-branch
```

Or you can rebase against `master` branch:

```test
$ git fetch --all
$ git rebase origin/master
$ git push --force-with-lease origin my-branch
```

Or you can amend the last commit (for example if you want to change the commit message):

```text
$ git add any/changed/files
$ git commit --amend
$ git push --force-with-lease origin my-branch
```

**important:** The `git push --force-with-lease` command is one of the few ways to delete history in git. Before using it, make sure you understand the risks.

Feel free to post a comment in the Pull Request to ping reviewers if you are awaiting an answer on seomthing.


### Additional Notes:

None.

