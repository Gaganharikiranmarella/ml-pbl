from __future__ import annotations

from typing import Dict, Iterable, List


def estimate_time_complexity(method: str, n_values: Iterable[int]) -> List[float]:
    """Returns normalized time complexity estimates for method comparisons."""

    curves = {
        "grape": lambda n: 1.6 * (n**2),
        "krotov": lambda n: 1.3 * (n**2.2),
        "pontryagin": lambda n: 1.1 * (n**1.9),
        "shortcuts": lambda n: 0.9 * (n**1.6),
    }
    fn = curves[method.lower()]
    return [float(fn(n)) for n in n_values]


def estimate_space_complexity(method: str, n_values: Iterable[int]) -> List[float]:
    """Returns normalized memory complexity estimates for method comparisons."""

    curves = {
        "grape": lambda n: 0.8 * n,
        "krotov": lambda n: 1.1 * n,
        "pontryagin": lambda n: 0.9 * n,
        "shortcuts": lambda n: 0.6 * n,
    }
    fn = curves[method.lower()]
    return [float(fn(n)) for n in n_values]


def complexity_report(n_values: Iterable[int]) -> Dict[str, Dict[str, List[float]]]:
    methods = ["grape", "krotov", "pontryagin", "shortcuts"]
    return {
        method: {
            "time": estimate_time_complexity(method, n_values),
            "space": estimate_space_complexity(method, n_values),
        }
        for method in methods
    }
