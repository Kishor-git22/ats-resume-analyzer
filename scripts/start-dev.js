import { spawnSync } from 'child_process';
if (process.env.VERCEL) {
  spawnSync('npm', ['run', 'dev:ui'], { stdio: 'inherit', shell: true });
} else {
  spawnSync('npx', ['vercel', 'dev'], { stdio: 'inherit', shell: true });
}
