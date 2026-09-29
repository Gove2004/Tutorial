import random, math
from collections import defaultdict

class RichGrid:
    """8x8 网格寻路。含障碍、随机起终点、距离塑形。
    动作 0-7：八方向移动；撞墙/障碍原地不动。"""
    def __init__(self, size=8, seed=0):
        self.size = size
        rng = random.Random(seed)
        self.walls = set()
        while len(self.walls) < 6:
            self.walls.add((rng.randrange(size), rng.randrange(size)))
        self._rng = random.Random(seed + 1)

    def reset(self):
        cells = [(x, y) for x in range(self.size)
                 for y in range(self.size) if (x, y) not in self.walls]
        while True:
            self.start = self._rng.choice(cells)
            self.goal = self._rng.choice(cells)
            if self.goal != self.start and self._connected(self.start, self.goal):
                break                              # 起终点不同且存在可行路径
        self.pos = self.start
        return self.obs()

    def _connected(self, start, goal):
        """BFS 检查 start 到 goal 是否存在可行路径，保证每局都有解。"""
        seen, stack = {start}, [start]
        while stack:
            x, y = stack.pop()
            if (x, y) == goal:
                return True
            for dx, dy in self.MOVES:
                nb = (x + dx, y + dy)
                if 0 <= nb[0] < self.size and 0 <= nb[1] < self.size \
                        and nb not in self.walls and nb not in seen:
                    seen.add(nb)
                    stack.append(nb)
        return False

    def obs(self):
        # 状态 = 相对终点位移 + 各方向是否可走掩码：
        # 既含目标信息（随机终点下满足马尔可夫性、可跨局泛化），又能在障碍前学会绕行
        rel = (self.goal[0] - self.pos[0], self.goal[1] - self.pos[1])
        return rel + tuple(self._move_mask())

    def _move_mask(self):
        mask = []
        for dx, dy in self.MOVES:
            nx = min(self.size-1, max(0, self.pos[0]+dx))
            ny = min(self.size-1, max(0, self.pos[1]+dy))
            mask.append(1 if (nx, ny) != self.pos and (nx, ny) not in self.walls else 0)
        return mask

    MOVES = [(-1,0),(1,0),(0,-1),(0,1),
             (-1,-1),(-1,1),(1,-1),(1,1)]

    def step(self, a):
        old_dist = math.dist(self.pos, self.goal)
        dx, dy = self.MOVES[a]
        nx = min(self.size-1, max(0, self.pos[0]+dx))
        ny = min(self.size-1, max(0, self.pos[1]+dy))
        if (nx, ny) not in self.walls:
            self.pos = (nx, ny)
        new_dist = math.dist(self.pos, self.goal)
        done = self.pos == self.goal
        reward = 10.0 if done else -0.01 + 0.1 * (old_dist - new_dist)
        return self.obs(), reward, done

class QLearner:
    def __init__(self, n_act=8, gamma=0.95, alpha=0.2, eps=0.2):
        self.g, self.a, self.eps = gamma, alpha, eps
        self.n = n_act
        self.Q = defaultdict(float)
    def act(self, s, explore=True):
        if explore and random.random() < self.eps:
            return random.randrange(self.n)
        return max(range(self.n), key=lambda a: self.Q[(s, a)])
    def learn(self, s, a, r, s2, done):
        target = r if done else r + self.g * max(
            self.Q[(s2, a2)] for a2 in range(self.n))
        self.Q[(s, a)] += self.a * (target - self.Q[(s, a)])

def train(episodes=3000, max_steps=200):
    env, agent = RichGrid(), QLearner()
    curve = []
    for ep in range(episodes):
        s, done, steps = env.reset(), False, 0
        while not done and steps < max_steps:
            a = agent.act(s)
            s2, r, done = env.step(a)
            agent.learn(s, a, r, s2, done)
            s, steps = s2, steps + 1
        curve.append(steps if done else max_steps)
        agent.eps = max(0.03, agent.eps * 0.999)
    return env, agent, curve

def evaluate(env, agent, trials=100):
    wins, total_steps = 0, 0
    for _ in range(trials):
        s, done, steps = env.reset(), False, 0
        while not done and steps < 200:
            s, _, done = env.step(agent.act(s, explore=False))
            steps += 1
        if done:
            wins += 1
            total_steps += steps
    print(f"成功率 {wins}%  成功局平均步数 {total_steps/max(wins,1):.1f}")

if __name__ == "__main__":
    env, agent, curve = train()
    for i in range(6):
        seg = curve[i*500:(i+1)*500]
        print(f"{i*500:4d}局 平均步数 {sum(seg)/len(seg):6.1f}")
    evaluate(env, agent)
