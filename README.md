# QOC RL Project

Interactive, modular project demonstrating **Reinforcement Learning applied to Quantum Optimal Control (QOC)**.

## Stack
- Backend: Python + JAX with unified Policy Gradient RL framework
- Frontend: Next.js + React + Tailwind + Framer Motion
- Interactive graphs: Plotly.js
- Deployment: Vercel

## Key Innovation: Unified RL Framework

All 4 QOC methods now use **the same Policy Gradient RL agent** with different configuration strategies:

| Method | Policy Strategy | Config | Purpose |
|--------|-----------------|--------|---------|
| **GRAPE** | Direct Amplitude | lr=0.02, scale=0.08 | Fast learning with broad exploration |
| **Krotov** | Smooth Regularized | lr=0.015, entropy=0.02 | Monotonic improvement via smoothness |
| **Pontryagin** | Costate-Inspired | lr=0.018, baseline=0.55 | Physics-informed policy updates |
| **STA** | Adiabatic-Inspired | lr=0.012, scale=0.03 | Minimal-power smooth pulses |

### How RL Works Here:
1. **Policy**: Learnable control amplitudes at each time step
2. **Environment**: Quantum system simulator (QOC problem)
3. **Reward**: Fidelity achieved - regularization penalty
4. **Agent**: REINFORCE with baseline (Actor-Critic style)
5. **Learning**: Policy Gradient updates over episodes

## Project Structure
```
backend/
+-- rl/
¦   +-- core.py         # RLEnvironment (quantum simulator)
¦   +-- agent.py        # PolicyGradientAgent (unified RL trainer)
¦   +-- __init__.py
+-- methods/
¦   +-- grape.py        # GRAPE using RL (direct learning)
¦   +-- krotov.py       # Krotov using RL (smooth policies)
¦   +-- pontryagin.py   # Pontryagin using RL (baseline guidance)
¦   +-- shortcuts.py    # STA using RL (adiabatic smoothing)
¦   +-- __init__.py
+-- requirements.txt

frontend/
+-- lib/methods.ts      # Method descriptions (updated for RL)
+-- components/         # UI components (unchanged)
+-- pages/              # App pages (unchanged)
+-- package.json
```

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (Python)
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run a quick test
python -c "
from backend.methods.grape import sample_problem, run_grape
drift, controls, target, dt, horizon = sample_problem()
result = run_grape(drift, controls, target, dt, horizon, episodes=50)
print(f'Final fidelity: {result.fidelity_history[-1]:.4f}')
"
```

## Example Usage

```python
from backend.rl.core import RLEnvironment
from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig
import jax.numpy as jnp

# Define QOC problem
sx = jnp.array([[0, 1], [1, 0]], dtype=jnp.complex64)
sz = jnp.array([[1, 0], [0, -1]], dtype=jnp.complex64)
target = jnp.array([[1, 0], [0, -1]], dtype=jnp.complex64)

# Create RL environment
env = RLEnvironment(
    drift=0.2 * sz,
    controls=(sx, sz),
    target=target,
    dt=0.05,
    horizon=80
)

# Train with different strategies
configs = {
    "GRAPE": PolicyGradientConfig(episodes=150, learning_rate=0.02, policy_scale=0.08),
    "Krotov": PolicyGradientConfig(episodes=120, learning_rate=0.015, entropy_coef=0.02),
    "Pontryagin": PolicyGradientConfig(episodes=140, learning_rate=0.018, baseline_weight=0.55),
    "STA": PolicyGradientConfig(episodes=110, learning_rate=0.012, entropy_coef=0.03),
}

for name, config in configs.items():
    agent = PolicyGradientAgent(env, config)
    result = agent.train()
    print(f"{name}: Final fidelity = {result.fidelity_history[-1]:.4f}")
```

## Production Build

```bash
cd frontend
npm run build
npm start
```

## Deploy to Vercel

```bash
git add .
git commit -m "RL-based QOC methods"
git push origin main
```

Then:
1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Deploy

## Frontend Pages

- **Home** (`/`): Overview of all 4 methods with interactive cards
- **Method Page** (`/methods/[method]`): 
  - Theory: RL approach for this method
  - Code: Python/JAX implementation snippet
  - Graph: Interactive complexity visualization
  - Example: Real-world use case

## RL Algorithm Details

### PolicyGradientAgent
- **Algorithm**: REINFORCE with baseline
- **Loss**: -log_prob * advantage - entropy_regularization
- **Update**: ? ? ? - a?L(?)
- **Baseline**: Running estimate of expected reward
- **Exploration**: Entropy bonus prevents premature convergence

### Key Files
- `backend/rl/core.py`: RLEnvironment (reward computation, simulation)
- `backend/rl/agent.py`: PolicyGradientAgent (training loop)
- Each method file imports and configures the same agent differently

## Future Enhancements
- Add Actor-Critic or PPO for better variance reduction
- Implement transfer learning across problem sizes
- Add visualization of learned policy landscapes
- Benchmark against classical methods
