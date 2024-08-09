# Github Policy and Best Practices

<!-- This is WIP, with some of the notes and thoughts not fully developed -->

<!-- Add links when completed -->

## Table of Contents

1. [Overview](#overview)
2. [Glossary of Terms](#glossary-of-term)
3. [Best Practices](#best-practices)
4. [Giving Feeback](#giving-feeback)
5. [Github Pull Request Template](#template)
6. [Github Issue Labels](#github-issue-labels)

## Overview

Digital Democracy's codebase is maintained using Git and hosted on GitHub. Pull requests can be made if you would like to contribute to our codebase. Before creating a pull request please refer to our [contributing doc]().

Please refer to

## Glossary of Term

- PR

  > Acronym for "Pull Request"

- Rebase

  > This is the process of reording the commit history, so the commits on the PR show up at the head of the commit history. In otherwords, we are changing the base of the commit history, so that the history remains linear.

- Merge

  > This is the process of combining the commit history so that commits of the PR just merge with the commits of the base branch.

- Version Control

  > This is the process of tracking and managing edits to a codebase.

- Pull Request

## Best Practices

[I am a contibutor](#for-contributors)

[I am reviewing a PR](#reviwing-pr)

### **For contributors:**

- Follow `Conventional Commit Guidelines`.

  > The [Conventional Commit Guidelines](https://www.conventionalcommits.org/en/v1.0.0/) are rules for naming and labelling commits. By following these guidlines we

- Follow the template.

  > When creating a pr, the template for the description will autmatically appear (I will add this once we come up with a template). Please follow the instructions on the template.

- Rebase when possible, only merge if absolutely necessary.

  > In order to keep the history of edits in a linear order, try to rebase from the base branch. Rebasing is typically more complicated, and may sometimes be too difficult. If that is the case, then merge.

- Include translated strings with approriate descriptions.

  > Check that you have included the localization/translation for all strings. Make sure the string can be understood by an external translator who may not have any context. If it is ambiguous, add a description. You can learn more about translations [here]()

- Point the base branch to `develop`, unless you are working on smaller pieces of a bigger project (eg. sprints, new feature).

  > All pr's should have `develop` as the base branch. The exception is when you are creating smaller pieces of a larger feature. If that is the case, the base branch of this larger feature branch should be `develop`. You can learn more about how to change the base branch [here]()

- Take out all unnecessary comments.

  > Any comments in the code that do not communicate a meaningful message to another developer should be changed to a meaningful message or taken out of the code. GIVE EXAMPLE

- Code has been tested.

  > Make sure that you have fully tested your code on a device or emulator. It is up to you as the author, to make sure everything is functioning the way that you intended.

- Be Timely.

  > After someone has reviewed you PR and left comments, try to address those comments within 48 hours. This keeps it fresh for yourself and the reviewer, making it easier to understand the comments.

    <!-- I feel like i need to explain this a little better -->

- Make sure test passes CI.
  > Our CI tests take a few minutes to run after a PR has been created in Github. Check to make sure that these tests have passed. If they did not pass, see troubleshooting (TODO).

### **Reviwing PR**

- Don't Fix the code, just comment on Github

  > If you see any mistakes, just add a comment in github instead of going in and trying to fix it yourself. This keeps the edit history clean and unambigous as to where the contribution came from.

- Be timely

  > When reviewing, make sure to review the entire PR. Commenting on part of the code, while not looking at other parts of the code may lead to confusion down line. Try to address any replies from the author within 48 hours. This keeps it fresh for yourself and the contributor, making it easier to understand the comments.

- Check translations.

  > Make sure all strings are translation strings (not hardcoded). As well make sure that string will make sense for the translator who will not have any context. If it is ambigous, ask the author of the PR to add a description. You can learn more about translations [here]()

- Check for any unecessary comments.

  > If the comment does not express something meaningful to another developer, ask the author to change or delete the comment. This includes any code that is commented out. If you do not know why code is commented out, ask the author to leave a comment explaining why it is commented out, or to erase it entirely.

- Does the code make sense?

  > If there is anything that doesn't make sense, leave a comment asking for clarification. After clarification, can you suggest another way to write the code, that makes it more human readable? If not, ask the contributor to add a comment above giving a brief explanation

- Squash and merge.
  > When the PR has been approved, (squash and merge)[] instead of just merging. This makes the history show by order or PR instead of commit

## Giving Feeback

- Give constructive feedback

  > The feedback should either be asking a question, or giving suggestions about how to fix something. For example, if something is unclear, instead of saying "This is unclear", ask the author "Can you explain what you are doing here?", or say "This is unclear, here is how you can make it more obvious..."

- Be descriptive while being concise
  > Describe the issue, while making it very clear what you are describing. Steer away from any unnecessary language.

* Be Empathetic
  > Give feedback that humanizes the author, and recognizes the work that has gone into it. Try to use gentle language. Ask questions, when you are unsure, instead of assuming that something is done incorecctly. Use "I" instead of "you" when giving feedback. For example, dont say "You did this wrong", say "I would have done this x way, can you explain why it was done this way?".

## Template

> # Header
>
> Give the header a meaningful name that describes what you are doing. For Example, "New Page" is too broad of a name that doesn't specifiy what bug fix has been done. Instead use "Intro Page for App tutorial Created." Try to be descriptive, while also being concise.
>
> # Description
>
> Describe What exactly has been done:
> Give a highlevel overview of what work has been done.
>
> If there has been a change in the UI, also describe how to view this change in the app. When necessary give step by step instructions on what steps to recreate in order to view this change.
>
> If this is a bug fix, describe what the original bug was.
>
> Add Screen shots of the new UI
>
> # Wireframes
>
> Include link to wireframes here
>
> # To Do
>
> Include any tasks that still need to be completed that cannot be addressed in this PR
> GIVE EXAMPLES HERE

## How To

- Create a new branch:

  > [Github Desktop Video]()

- Change Base Branch:

  >

- Create a PR

  >

- Merge

  >

- Rebase

  >

- Squash and Merge

  >

- Translations
  >

## Github Issue Labels

When creating an issue in github please use the following tags:

`Bug`

> This is any issue where the app is crashing, breaking, or doing an behaviour that is unexpected.

`Dependency`

> This is any work that needs to be done with the dependencies. These are often upgrades of the dependencies.

`Enhancement`

> This is a suggestion of something that may make the app better. This can range from minor adjusments to new features.

`Nuggets`

> This is used by the Digital Democract internal team as small items that can be addressed every sprint. These items should not take more then a few hours.

Specific Project (eg. `OTF`, `P2P`)

> These labels are used to keep track of specific projects that Digital Democracy are doing.

`Research`

> These are to indicate when research need to be done and documented. This tag is typically used when we are adding a new dependency or feature, and we need to compile information about it before hand.

`Sprint Candidate`

> This tag is used to keep track of items that will possible be added to the upcoming sprint. This tag should only be used by the Project Manager, or the individuals planning the next sprint.

`Tech Prio`

> This label for items that have been identified by DD's program team as priorities for the tech team to address. This is an internal label, and should only be used by DD team members.

`Documentation`

> This tag is for items relating to documenation. This includes internal and external documentation.

`Good First Issue`

>
