import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './postRouter';
import { draftsRouter } from './draftsRouter';
import { homeRouter } from './homeRouter';
import { accountRouter } from './accountRouter';

export const appRouter = router({
  post: postRouter,
  drafts: draftsRouter,
  home: homeRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
