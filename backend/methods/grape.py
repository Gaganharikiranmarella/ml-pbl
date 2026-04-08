from __future__ import annotations

import jax.numpy as jnp

from .common import (
    OptimizationResult,
    QOCProblem,
    initial_pulses,
    optimize_with_gradient_descent,
)


def run_grape(
    problem: QOCProblem,
    steps: int = 250,
    learning_rate: float = 3e-2,
    l2_reg: float = 1e-4,
) -> OptimizationResult:
    """GRAPE: gradient ascent over piecewise-constant control amplitudes."""

    pulses = initial_pulses(len(problem.controls), problem.horizon, scale=0.05)
    result = optimize_with_gradient_descent(
        problem=problem,
        pulses=pulses,
        steps=steps,
        learning_rate=learning_rate,
        l2_reg=l2_reg,
    )
    return result


def sample_problem() -> QOCProblem:
    sx = jnp.array([[0, 1], [1, 0]], dtype=jnp.complex64)
    sz = jnp.array([[1, 0], [0, -1]], dtype=jnp.complex64)
    hadamard = (1 / jnp.sqrt(2)) * jnp.array([[1, 1], [1, -1]], dtype=jnp.complex64)
    return QOCProblem(
        drift=0.2 * sz,
        controls=(sx, sz),
        target=hadamard,
        dt=0.05,
        horizon=80,
    )
