"""
graph.py
Weighted, undirected Graph representing the transportation network
between cities, ferry terminals, and beaches.

Follows the class style from:
  Lecture 7 (Graph Fundamentals)  -> adjacency list representation
  Lecture 8 (Graph Traversal)     -> add_edge, remove_edge, display, BFS, DFS
  Lecture 9 (Shortest Path)       -> Dijkstra's algorithm
"""

import heapq


class Graph:
    def __init__(self):
        self.adjacency_list = {}  # node -> {neighbor: weight}

    def add_vertex(self, name):
        if name not in self.adjacency_list:
            self.adjacency_list[name] = {}

    def add_edge(self, node1, node2, weight):
        self.add_vertex(node1)
        self.add_vertex(node2)
        self.adjacency_list[node1][node2] = weight
        self.adjacency_list[node2][node1] = weight  # undirected

    def remove_edge(self, node1, node2):
        if node1 in self.adjacency_list and node2 in self.adjacency_list[node1]:
            del self.adjacency_list[node1][node2]
            del self.adjacency_list[node2][node1]

    def display(self):
        print("\n========== Transportation Network ==========\n")

        for node, neighbors in self.adjacency_list.items():
            print(node)

            if not neighbors:
                print("  No connected locations.")
            else:
                for neighbor, distance in neighbors.items():
                    print(f"  • {neighbor} ({distance} km)")

    def bfs(self, start):
        visited = {start}
        queue = [start]
        order = []

        while queue:
            node = queue.pop(0)
            order.append(node)
            for neighbor in self.adjacency_list.get(node, {}):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return order

    def dfs(self, start):
        visited = set()
        order = []

        def _dfs(node):
            visited.add(node)
            order.append(node)
            for neighbor in self.adjacency_list.get(node, {}):
                if neighbor not in visited:
                    _dfs(neighbor)

        _dfs(start)
        return order

    def dijkstra(self, start):
        """
        Single-source shortest path.
        Returns (distances, previous) so the path can be rebuilt.
        """
        distances = {node: float("inf") for node in self.adjacency_list}
        previous = {node: None for node in self.adjacency_list}
        distances[start] = 0

        priority_queue = [(0, start)]
        visited = set()

        while priority_queue:
            current_distance, current_node = heapq.heappop(priority_queue)

            if current_node in visited:
                continue
            visited.add(current_node)

            for neighbor, weight in self.adjacency_list.get(current_node, {}).items():
                new_distance = current_distance + weight
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
                    previous[neighbor] = current_node
                    heapq.heappush(priority_queue, (new_distance, neighbor))

        return distances, previous

    def shortest_path(self, start, end):
        distances, previous = self.dijkstra(start)

        if distances.get(end, float("inf")) == float("inf"):
            return None, float("inf")  # no path found

        path = []
        node = end
        while node is not None:
            path.append(node)
            node = previous[node]
        path.reverse()

        return path, distances[end]
