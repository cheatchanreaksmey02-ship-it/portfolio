"""
hash_table.py
Hash Table that stores Beach objects, keyed by GPS location (lat, lon).

Follows the class style from Lecture 2 (Hash Table Fundamentals) and
Lecture 3 (Hash Table Applications):
  - hash_function(key)
  - insert(key, value)
  - search(key)
  - delete(key)
  - display()

Collisions are handled with chaining: each bucket is a list of
[key, value] pairs (same idea as the "list of lists" Contact
Management System example).

Key = GPS tuple, e.g. (10.565, 103.135)
Value = Beach object
"""


class HashTable:
    def __init__(self, capacity=16):
        self.capacity = capacity
        self.table = [[] for _ in range(self.capacity)]  # list of buckets, each bucket is a list of [key, value]

    def hash_function(self, key):
        """
        Division method: turn the GPS tuple into one integer, then mod
        by the table size -> h(k) = k mod m
        """
        lat, lon = key
        # scale the floats to integers so decimals still affect the hash
        numeric_key = int(abs(lat) * 1000) + int(abs(lon) * 1000)
        return numeric_key % self.capacity

    def insert(self, key, value):
        index = self.hash_function(key)
        bucket = self.table[index]

        for pair in bucket:
            if pair[0] == key:
                pair[1] = value  # key already exists -> update value
                return

        bucket.append([key, value])

    def search(self, key):
        index = self.hash_function(key)
        bucket = self.table[index]

        for pair in bucket:
            if pair[0] == key:
                return pair[1]
        return None

    def delete(self, key):
        index = self.hash_function(key)
        bucket = self.table[index]

        for i, pair in enumerate(bucket):
            if pair[0] == key:
                bucket.pop(i)
                return True
        return False

    def display(self):
        for index, bucket in enumerate(self.table):
            if bucket:
                print(f"Bucket {index}:")
                for key, value in bucket:
                    print(f"   GPS {key} -> {value}")

    def all_values(self):
        """Return every Beach stored in the table (used for filtering/recommendations)."""
        values = []
        for bucket in self.table:
            for _, value in bucket:
                values.append(value)
        return values
