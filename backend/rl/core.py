"""Core RL environment for quantum optimal control."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

import jax
import jax.numpy as jnp


@dataclass(frozen=True)
class RLResult:
    """Result from RL training."""

    policies: dict[str, jnp.ndarray]
    reward_history: jnp.ndarray
    fidelity_history: jnp.ndarray
    metadata: dict


class RLEnvironment:
    """RL environment that wraps a QOC problem."""

    def __init__(
        self,
        drift: jnp.ndarray,
        controls: tuple[jnp.ndarray, ...],
        target: jnp.ndarray,
        dt: float,
        horizon: int,
    ):
        self.drift = drift
        self.controls = controls
        self.target = target
        self.dt = dt
        self.horizon = horizon
        self.dim = drift.shape[0]

    def step(self, pulse_slice: jnp.ndarray) -> jnp.ndarray:
        """Execute one time step with given control amplitudes."""
        ham = self.drift
        for i, ctrl in enumerate(self.controls):
            ham = ham + pulse_slice[i] * ctrl
        return jax.scipy.linalg.expm(-1j * ham * self.dt)

    def simulate(self, pulses: jnp.ndarray) -> jnp.ndarray:
        """Simulate full evolution and return final unitary."""
        u = jnp.eye(self.dim, dtype=jnp.complex64)

        def body_fn(i, carry):
            step = self.step(pulses[:, i])
            return step @ carry

        return jax.lax.fori_loop(0, self.horizon, body_fn, u)

    def compute_fidelity(self, pulses: jnp.ndarray) -> jnp.ndarray:
        """Compute fidelity between achieved and target unitary."""
        u_final = self.simulate(pulses)
        overlap = jnp.trace(self.target.conj().T @ u_final)
        return jnp.abs(overlap) / self.dim

    def compute_reward(self, pulses: jnp.ndarray, reg: float = 1e-4) -> jnp.ndarray:
        """Compute reward: fidelity minus regularization penalty."""
        fidelity = self.compute_fidelity(pulses)
        smoothness = jnp.mean(pulses**2)
        return fidelity - reg * smoothness
