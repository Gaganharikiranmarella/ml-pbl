from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Dict, Tuple

import jax
import jax.numpy as jnp

Array = jnp.ndarray


@dataclass(frozen=True)
class QOCProblem:
    """Container for a small closed-system quantum optimal control problem."""

    drift: Array
    controls: Tuple[Array, ...]
    target: Array
    dt: float
    horizon: int


@dataclass(frozen=True)
class OptimizationResult:
    """Generic optimizer output shared by all methods."""

    pulses: Array
    loss_history: Array
    fidelity_history: Array
    metadata: Dict[str, float]


def initial_pulses(num_controls: int, horizon: int, scale: float = 0.1) -> Array:
    return jnp.zeros((num_controls, horizon)) + scale


def control_hamiltonian(problem: QOCProblem, pulse_slice: Array) -> Array:
    ham = problem.drift
    for i, ctrl in enumerate(problem.controls):
        ham = ham + pulse_slice[i] * ctrl
    return ham


def unitary_from_pulses(problem: QOCProblem, pulses: Array) -> Array:
    """Evolves U(t) with a first-order matrix exponential approximation."""

    dim = problem.drift.shape[0]
    u = jnp.eye(dim, dtype=jnp.complex64)

    def body_fn(i: int, carry: Array) -> Array:
        ham = control_hamiltonian(problem, pulses[:, i])
        step = jax.scipy.linalg.expm(-1j * ham * problem.dt)
        return step @ carry

    return jax.lax.fori_loop(0, problem.horizon, body_fn, u)


def fidelity(problem: QOCProblem, pulses: Array) -> Array:
    u_final = unitary_from_pulses(problem, pulses)
    overlap = jnp.trace(problem.target.conj().T @ u_final)
    dim = problem.target.shape[0]
    return jnp.abs(overlap) / dim


def objective(problem: QOCProblem, pulses: Array, l2_reg: float = 1e-3) -> Array:
    f = fidelity(problem, pulses)
    smooth_penalty = l2_reg * jnp.mean(pulses**2)
    return 1.0 - f + smooth_penalty


def optimize_with_gradient_descent(
    problem: QOCProblem,
    pulses: Array,
    steps: int,
    learning_rate: float,
    l2_reg: float,
) -> OptimizationResult:
    """Simple reusable gradient loop used by GRAPE and as a baseline."""

    grad_fn = jax.grad(lambda p: objective(problem, p, l2_reg=l2_reg))

    loss_hist = []
    fidelity_hist = []
    current = pulses

    for _ in range(steps):
        grads = grad_fn(current)
        current = current - learning_rate * grads
        loss_hist.append(objective(problem, current, l2_reg=l2_reg))
        fidelity_hist.append(fidelity(problem, current))

    return OptimizationResult(
        pulses=current,
        loss_history=jnp.array(loss_hist),
        fidelity_history=jnp.array(fidelity_hist),
        metadata={
            "steps": float(steps),
            "learning_rate": learning_rate,
            "l2_reg": l2_reg,
        },
    )
