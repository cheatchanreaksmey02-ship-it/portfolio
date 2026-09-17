"""
decision_tree.py
Decision Tree that walks the user through the flowchart:

    Start
     |-- Budget?        (Low / High)
     |-- Activity?      (Swimming / Camping / Snorkeling)
     |-- Number of People?  (1-2 / 3-5 / 6+)
     |-- Recommendation

Follows the general-tree style from Lecture 4 (Tree Basics): a root
node with children, where each child is reached by following an
answer down the tree.
"""


class TreeNode:
    def __init__(self, question=None, category=None):
        self.question = question    # question asked at this node (None for a leaf)
        self.category = category    # recommended beach category (only set on a leaf)
        self.children = {}          # answer (str) -> TreeNode

    def add_child(self, answer, node):
        self.children[answer] = node

    def is_leaf(self):
        return self.category is not None


class DecisionTree:
    def __init__(self):
        self.root = self._build_tree()

    def _build_tree(self):
        root = TreeNode(question="Budget?")

        for budget in ["Low", "High"]:
            budget_node = TreeNode(question="Activity?")
            root.add_child(budget, budget_node)

            for activity in ["Swimming", "Camping", "Snorkeling"]:
                activity_node = TreeNode(question="Number of People?")
                budget_node.add_child(activity, activity_node)

                for people in ["1-2", "3-5", "6+"]:
                    category = self._recommend_category(budget, people)
                    leaf = TreeNode(category=category)
                    activity_node.add_child(people, leaf)

        return root

    def _recommend_category(self, budget, people):
        """Simple rule used to build the leaves of the tree."""
        if budget == "High":
            return "Luxury"
        if people == "1-2":
            return "Quiet"
        if people == "3-5":
            return "Nature"
        return "Crowd"  # 6+

    def recommend(self, budget, activity, people):
        """Walk Start -> Budget -> Activity -> People -> Recommendation."""
        node = self.root
        node = node.children[budget]
        node = node.children[activity]
        leaf = node.children[people]
        return leaf.category, activity
