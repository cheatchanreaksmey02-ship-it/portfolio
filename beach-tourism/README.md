# Beach Tourism Recommendation System

A Python command-line app that recommends beaches in Cambodia (Kep, Kampot, and Preah Sihanouk provinces) based on budget, activity, and group size.

## How it works

The project combines three custom data structures:

- **Hash Table** — stores each beach, keyed by its GPS coordinates
- **Graph** — models the road/ferry network connecting cities and beaches
- **Decision Tree** — asks the user a series of questions (budget, activity, group size) and filters beaches accordingly

## Project structure

```
beach-tourism/
├── main.py            # Entry point — runs the CLI
├── beach.py           # Beach data model
├── hash_table.py       # Hash table implementation
├── graph.py            # Graph implementation
├── decision_tree.py    # Decision tree logic
└── data/
    ├── beaches.json     # Beach records
    └── network.json     # Road/ferry network data
```

## Running it

```bash
python main.py
```

## Note

`main.py` currently has a hardcoded admin password. Consider moving this to an environment variable before deploying or sharing widely.
