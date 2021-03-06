import { rest } from 'msw';
import faker from 'faker';

import * as AuthTypes from 'domains/Auth/types';
import { User } from 'types';

export const makeUser = () => ({
    _id: faker.random.alphaNumeric(5),
    roles: ['admin', 'organizer', 'user'],
    email: {
        address: faker.internet.email(),
        verified: Math.random() > 0.5,
    },
    settings: {
        townhall: {
            anonymous: Math.random() > 0.5,
        },
        notifications: {
            enabled: Math.random() > 0.5,
            types: [],
        },
    },
});

export const makeUsers = (num?: number): User[] => {
    const ret = [];
    const iterations = num || 1;
    for (let i = 0; i < iterations; i += 1) {
        ret.push(makeUser());
    }
    return ret;
};

export default [
    rest.post('/api/users/login', (req, res, ctx) => {
        // we do nothing with the password for now
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password } = req.body as {
            email: string;
            password: string;
        };
        if (password === 'fail') {
            return res(ctx.status(400));
        }
        return res(
            ctx.cookie('jwt', 'not a real jwt'),
            ctx.status(200),
            ctx.json({
                _id: faker.random.alphaNumeric(5),
                roles: ['user', 'admin', 'organizer'],
            })
        );
    }),
    rest.post('/api/users/login-temporary', (req, res, ctx) => {
        const { password } = req.body as {
            password: string;
        };
        if (password === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.cookie('jwt', 'not a real jwt'), ctx.status(200));
    }),

    rest.post('/api/users/consume-password-reset-token', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { token, form } = req.body as {
            token: string;
            form: AuthTypes.ForgotPassForm;
        };
        if (form.password === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200, 'Password Reset'));
    }),

    rest.post('/api/users/request-password-reset', (req, res, ctx) => {
        const { form } = req.body as {
            form: AuthTypes.ForgotPassRequestForm;
        };
        if (form.email === 'fail1234@gmail.com') {
            res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    rest.post('/api/users/register', (req, res, ctx) => {
        const { form } = req.body as {
            form: AuthTypes.RegisterForm;
        };
        if (form.email === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    rest.post('/api/confirm/user-email', (req, res, ctx) => {
        const { userId } = req.body as { userId: string };
        if (userId === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),
    rest.get('/api/users/me', (req, res, ctx) => {
        const { jwt } = req.cookies;
        if (jwt) return res(ctx.status(200), ctx.json(makeUser()));
        return res(ctx.status(401));
    }),
];
