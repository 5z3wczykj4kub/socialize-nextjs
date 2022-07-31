import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from 'next';

declare module 'iron-session' {
  interface IronSessionData {
    userId: string;
  }
}

const sessionOptions = {
  password: process.env.IRON_SESSION_COOKIE_PASSWORD!,
  cookieName: process.env.IRON_SESSION_COOKIE_NAME!,
  /**
   * NOTE:
   * Can't be used in development (HTTP).
   * Should be used in production (HTTPS).
   */
  // secure: true,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

const withSessionRoute = (handler: NextApiHandler) =>
  withIronSessionApiRoute(handler, sessionOptions);

const withSessionSsr = <
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => {
  return withIronSessionSsr(handler, sessionOptions);
};

export { withSessionRoute, withSessionSsr };
