# Contributing

We are a five-person hackathon team. There are no fixed feature owners and no
formal claiming process.

## During the day

1. Tell the group what you want to build in slack and add it to `WORKBOARD.md` so nobody starts the same work.
2. Pull the latest `main` and create your own branch:

```bash
git switch main
git pull
git switch -c feat/short-description
```

3. Build, test, and commit on that branch. **Remember to leave an implementation document in doc/ about your implementation.** 
4. If your direction changes or you need to edit a shared part of the project,
   tell the group.

Branch names can start with `feat/`, `fix/`, `content/`, or `chore/`.

## Every evening

1. Each person explains or demos what they built.
2. Discuss how the changes fit together and identify conflicts.
3. Run `make lint` and `make test`.
4. Merge the branches into `main` together, one at a time.
5. Resolve conflicts with the people who wrote the affected code.
6. Everyone pulls the updated `main`.

Run `make test-e2e` as well when a change affects navigation, forms, or API
integration.
