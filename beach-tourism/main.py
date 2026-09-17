"""
main.py
Cambodian Beach Tourism Recommendation System

Combines three data structures:
  - HashTable      : stores each Beach, keyed by its GPS location
  - Graph          : the road/ferry network between cities and beaches
  - DecisionTree   : asks Budget / Activity / Group size, then filters
                      beaches from the HashTable using the tree's answer
"""

import json

from beach import Beach
from hash_table import HashTable
from graph import Graph
from decision_tree import DecisionTree

BEACHES_FILE = "data/beaches.json"
NETWORK_FILE = "data/network.json"
ADMIN_PASSWORD = "admin123"

# Provinces must match the JSON "province" values exactly.
PROVINCES = ["Kep", "Kampot", "Preah Sihanouk"]


def load_beaches(path=BEACHES_FILE):
    table = HashTable()
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    for record in data:
        beach = Beach.from_dict(record)
        table.insert(beach.gps, beach)  # GPS tuple is the key
    return table


def save_beaches(table: HashTable, path=BEACHES_FILE):
    """Write the current contents of the HashTable back to beaches.json."""
    data = [beach.to_dict() for beach in table.all_values()]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def select_province(current=None):
    """
    Show a numbered province menu instead of free text input, so the
    value always exactly matches the JSON province values.
    If `current` is given, pressing Enter with no choice keeps it.
    """
    print("\nSelect Province:")
    for i, p in enumerate(PROVINCES, start=1):
        print(f"{i}. {p}")

    while True:
        if current:
            choice = input(f"> (leave blank to keep '{current}'): ").strip()
            if choice == "":
                return current
        else:
            choice = input("> ").strip()

        if choice in ("1", "2", "3"):
            return PROVINCES[int(choice) - 1]

        print("Invalid choice, please select 1, 2, or 3.")


def load_graph(path=NETWORK_FILE):
    graph = Graph()
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    for vertex in data["vertices"]:
        graph.add_vertex(vertex["name"])
    for edge in data["edges"]:
        graph.add_edge(edge["from"], edge["to"], edge["distance_km"])
    return graph


def print_menu():
    print("\n===== Cambodian Beach Tourism =====")
    print("1. View all beaches")
    print("2. Search beach by GPS coordinates")
    print("3. Search beach by province")
    print("4. Get a beach recommendation")
    print("5. Find shortest route to a beach (from Phnom Penh)")
    print("6. Show transportation network")
    print("7. Admin mode (add / edit / delete beaches)")
    print("8. Exit")


def view_all_beaches(table: HashTable):
    print("\n--- All Beaches ---")
    for beach in table.all_values():
        print(beach.summary())


def search_beach(table: HashTable):
    try:
        lat = float(input("Enter latitude: "))
        lon = float(input("Enter longitude: "))
    except ValueError:
        print("Please enter valid numbers.")
        return

    beach = table.search((lat, lon))
    if beach:
        print(beach.summary())
    else:
        print("No beach found at that GPS location.")


def search_beach_by_province(table: HashTable):
    print("\n--- Search by Province ---")
    province = select_province()
    matches = [b for b in table.all_values() if b.province == province]

    if matches:
        print(f"\n--- Beaches in {province} ---")
        for beach in matches:
            print(beach.summary())
    else:
        print(f"No beaches found in {province}.")


def get_recommendation(table: HashTable, tree: DecisionTree):
    print("\nBudget?  1) Low   2) High")
    budget = "Low" if input("> ") == "1" else "High"

    print("Activity?  1) Swimming  2) Camping  3) Snorkeling")
    activity_map = {"1": "Swimming", "2": "Camping", "3": "Snorkeling"}
    activity = activity_map.get(input("> "), "Swimming")

    print("Number of people?  1) 1-2   2) 3-5   3) 6+")
    people_map = {"1": "1-2", "2": "3-5", "3": "6+"}
    people = people_map.get(input("> "), "1-2")

    category, activity = tree.recommend(budget, activity, people)

    print(f"\nBased on your answers, we recommend '{category}' category beaches "
          f"with '{activity}':")

    matches = [
        beach for beach in table.all_values()
        if beach.category == category and activity in beach.activities
    ]

    if not matches:
        # relax the activity filter if nothing matches exactly
        matches = [beach for beach in table.all_values() if beach.category == category]

    if matches:
        for beach in matches:
            print(beach.summary())
    else:
        print("No matching beach found, try different answers.")


def find_shortest_route(table: HashTable, graph: Graph):
    print("\n--- Available beach destinations ---")
    for beach in table.all_values():
        print(f"{beach.beach_id}: {beach.name}")

    beach_id = input("Enter destination Beach ID: ").strip().upper()
    destination = next((b for b in table.all_values() if b.beach_id == beach_id), None)

    if destination is None:
        print("Beach ID not found.")
        return

    start = "Phnom Penh"
    path, distance = graph.shortest_path(start, destination.name)

    if path is None:
        print(f"No route found from {start} to {destination.name}.")
    else:
        print(f"\nShortest route from {start} to {destination.name}:")
        print(" -> ".join(path))
        print(f"Total distance: {distance} km")


def read_gps(prompt="Enter GPS"):
    try:
        lat = float(input(f"{prompt} latitude: "))
        lon = float(input(f"{prompt} longitude: "))
        return (lat, lon)
    except ValueError:
        print("Please enter valid numbers.")
        return None


def add_beach(table: HashTable):
    print("\n--- Add a new beach ---")
    gps = read_gps()
    if gps is None:
        return

    if table.search(gps) is not None:
        print("A beach already exists at that GPS location. Use Edit instead.")
        return

    beach_id = input("Beach ID (e.g. B14): ").strip().upper()
    name = input("Name: ").strip()
    province = select_province()
    category = input("Category (Quiet/Luxury/Adventure/Nature/Crowd): ").strip()

    try:
        rating = float(input("Rating (0-5): "))
        entrance_fee = float(input("Entrance fee (USD): "))
    except ValueError:
        print("Rating and entrance fee must be numbers.")
        return

    activities = [a.strip() for a in input("Activities (comma separated): ").split(",") if a.strip()]

    beach = Beach(beach_id, name, province, category, rating, entrance_fee, gps, activities)
    table.insert(gps, beach)  # create
    save_beaches(table)
    print(f"Added: {beach.summary()}")


def edit_beach(table: HashTable):
    print("\n--- Edit a beach ---")
    gps = read_gps("Enter the existing beach's GPS")
    if gps is None:
        return

    beach = table.search(gps)
    if beach is None:
        print("No beach found at that GPS location.")
        return

    print(f"Current: {beach.summary()}")
    print("Leave a field blank to keep its current value.")

    name = input(f"Name [{beach.name}]: ").strip()
    province = select_province(current=beach.province)
    category = input(f"Category [{beach.category}]: ").strip()
    rating = input(f"Rating [{beach.rating}]: ").strip()
    fee = input(f"Entrance fee [{beach.entrance_fee}]: ").strip()
    activities = input(f"Activities [{', '.join(beach.activities)}]: ").strip()

    if name:
        beach.name = name
    beach.province = province
    if category:
        beach.category = category
    if rating:
        try:
            beach.rating = float(rating)
        except ValueError:
            print("Invalid rating, keeping old value.")
    if fee:
        try:
            beach.entrance_fee = float(fee)
        except ValueError:
            print("Invalid fee, keeping old value.")
    if activities:
        beach.activities = [a.strip() for a in activities.split(",") if a.strip()]

    table.insert(gps, beach)  # update (same GPS key)
    save_beaches(table)
    print(f"Updated: {beach.summary()}")


def delete_beach(table: HashTable):
    print("\n--- Delete a beach ---")
    gps = read_gps()
    if gps is None:
        return

    beach = table.search(gps)
    if beach is None:
        print("No beach found at that GPS location.")
        return

    confirm = input(f"Delete '{beach.name}'? (y/n): ").strip().lower()
    if confirm == "y":
        table.delete(gps)
        save_beaches(table)
        print("Beach deleted.")
    else:
        print("Cancelled.")


def admin_menu(table: HashTable):
    password = input("Enter admin password: ")
    if password != ADMIN_PASSWORD:
        print("Incorrect password.")
        return

    while True:
        print("\n--- Admin mode ---")
        print("1. View all beaches")
        print("2. Add a beach")
        print("3. Edit a beach")
        print("4. Delete a beach")
        print("5. Back to main menu")
        choice = input("Select an option: ").strip()

        if choice == "1":
            view_all_beaches(table)
        elif choice == "2":
            add_beach(table)
        elif choice == "3":
            edit_beach(table)
        elif choice == "4":
            delete_beach(table)
        elif choice == "5":
            break
        else:
            print("Invalid option, try again.")


def main():
    table = load_beaches()
    graph = load_graph()
    tree = DecisionTree()

    while True:
        print_menu()
        choice = input("Select an option: ").strip()

        if choice == "1":
            view_all_beaches(table)
        elif choice == "2":
            search_beach(table)
        elif choice == "3":
            search_beach_by_province(table)
        elif choice == "4":
            get_recommendation(table, tree)
        elif choice == "5":
            find_shortest_route(table, graph)
        elif choice == "6":
            graph.display()
        elif choice == "7":
            admin_menu(table)
        elif choice == "8":
            print("Goodbye!")
            break
        else:
            print("Invalid option, try again.")


if __name__ == "__main__":
    main()
