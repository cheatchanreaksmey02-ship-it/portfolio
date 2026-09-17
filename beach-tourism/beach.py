"""
beach.py
Simple data model for one beach destination.
"""


class Beach:
    def __init__(self, beach_id, name, province, category,
                 rating, entrance_fee, gps, activities, extra=None):
        self.beach_id = beach_id
        self.name = name
        self.province = province
        self.category = category        # Quiet / Luxury / Adventure / Nature / Crowd
        self.rating = rating            # 0.0 - 5.0
        self.entrance_fee = entrance_fee  # USD
        self.gps = gps                  # (lat, lon)
        self.activities = activities    # list[str]
        # any other fields from the JSON record (description, opening_time,
        # closing_time, restaurants_nearby, ...) are kept here so saving
        # back to disk does not lose data.
        self.extra = extra if extra is not None else {}

    @staticmethod
    def from_dict(d: dict) -> "Beach":
        known_keys = {"beach_id", "name", "province", "category", "rating",
                      "entrance_fee", "gps", "activities"}
        extra = {k: v for k, v in d.items() if k not in known_keys}
        return Beach(
            beach_id=d["beach_id"],
            name=d["name"],
            province=d["province"],
            category=d["category"],
            rating=d["rating"],
            entrance_fee=d["entrance_fee"],
            gps=tuple(d["gps"]),
            activities=list(d["activities"]),
            extra=extra,
        )

    def to_dict(self) -> dict:
        """Convert this Beach back into a JSON-serializable dict for saving."""
        d = dict(self.extra)
        d.update({
            "beach_id": self.beach_id,
            "name": self.name,
            "province": self.province,
            "category": self.category,
            "rating": self.rating,
            "entrance_fee": self.entrance_fee,
            "gps": list(self.gps),
            "activities": self.activities,
        })
        return d

    def summary(self) -> str:
        name_prov = f"[{self.beach_id}] {self.name} ({self.province})"
        gps_str = f"GPS: ({self.gps[0]}, {self.gps[1]})"
        cat_str = f"Category: {self.category}"
        rate_str = f"Rating: {self.rating}/5"
        fee_str = f"Fee: ${self.entrance_fee:.2f}"
        act_str = f"Activities: {', '.join(self.activities)}"

        return (f"{name_prov:<41} | "
                f"{gps_str:<23} | "
                f"{cat_str:<19} | "
                f"{rate_str:<12} | "
                f"{fee_str:<12} | "
                f"{act_str}")
    def __repr__(self):
        return f"Beach({self.beach_id}, {self.name})"
