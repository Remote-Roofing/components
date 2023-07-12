import { UserConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

const opts: UserConfig = {
  plugins: [tsConfigPaths()],
};
export default opts;
