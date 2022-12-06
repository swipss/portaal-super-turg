import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './postRouter';
import { userRouter } from './userRouter';

export const appRouter = router({
  post: postRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
