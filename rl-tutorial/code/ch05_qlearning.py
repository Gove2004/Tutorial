import random

class SlipperyGrid:
    """6x6 网格，目标(5,5)。动作 0上1下2左3右；
    0.8 按意图移动，0.2 打滑到随机方向；撞墙原地不动。"""
    def __init__(self, size=6, seed=0):
        self.size = size
        self.goal = (size - 1, size - 1)
        self.rng = random.Random(seed)

    def reset(self):
        self.pos = (0, 0)
        return self.pos

    def step(self, action):
        if self.rng.random() < 0.2:
            action = self.rng.randrange(4)
        x, y = self.pos
        if   action == 0: x = max(0, x - 1)
        elif action == 1: x = min(self.size - 1, x + 1)
        elif action == 2: y = max(0, y - 1)
        else:             y = min(self.size - 1, y + 1)
        self.pos = (x, y)
        done = self.pos == self.goal
        return self.pos, (1.0 if done else -0.01), done

class QLearningAgent:
    def __init__(self, n_actions=4, gamma=0.95, alpha=0.1, epsilon=0.2):
        self.g, self.a, self.eps = gamma, alpha, epsilon
        self.n_actions = n_actions
        self.Q = {}
    def q(self, s, a):
        return self.Q.get((s, a), 0.0)
    def act(self, s, explore=True):
        if explore and random.random() < self.eps:
            return random.randrange(self.n_actions)
        return max(range(self.n_actions), key=lambda a: self.q(s, a))
    def learn(self, s, a, r, s2, done):
        target = r if done else r + self.g * max(
            self.q(s2, a2) for a2 in range(self.n_actions))
        self.Q[(s, a)] = self.q(s, a) + self.a * (target - self.q(s, a))

if __name__ == "__main__":
    env = SlipperyGrid()
    agent = QLearningAgent()
    history = []
    for ep in range(2000):
        s, done, steps = env.reset(), False, 0
        while not done and steps < 200:
            a = agent.act(s)
            s2, r, done = env.step(a)
            agent.learn(s, a, r, s2, done)
            s, steps = s2, steps + 1
        history.append(steps)
    print("每 200 回合的平均步数：")
    for i in range(10):
        avg = sum(history[i*200:(i+1)*200]) / 200
        print(f"{i*200:4d}-{(i+1)*200:4d}  {avg:6.1f}  {'#' * int(avg / 2)}")
    wins = 0
    for _ in range(100):
        s, done, steps = env.reset(), False, 0
        while not done and steps < 200:
            s, _, done = env.step(agent.act(s, explore=False))
            steps += 1
        if done:
            wins += 1
    print(f"测试成功率：{wins}%")
