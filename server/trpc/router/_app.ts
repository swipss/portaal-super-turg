import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './postRouter';
import { draftsRouter } from './draftsRouter';
import { homeRouter } from './homeRouter';

export const appRouter = router({
  post: postRouter,
  drafts: draftsRouter,
  home: homeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
