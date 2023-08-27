const HealthResolver = require('./resolvers/HealthResolver');
// const UserService = require("../services/UserService");
const WithAuthResolver = require('./resolvers/WithAuthResolver');
const MutationWithAuthResolver = require('./resolvers/MutationWithAuthResolver');
const {enc, dec} = require('../bootloader/security/StatelessMiddleware');

/**
 * The resolver root class
 * */
exports = module.exports = class ResolverRoot {

    async health() {
        return new HealthResolver();
    }

    async withAuth({token}, ctx) {
        //todo make work
        const user = await UserService.authenticate(token, ctx.user);
        if (!user) {
            ctx.forceResponseCode = 401;
            throw new Error('Invalid Auth Provided. Token not valid.');
        }
        return new WithAuthResolver(user, token);
    }

    async mutationWithAuth({token}, ctx) {
        const user = await UserService.authenticate(token, ctx.user);
        if (!user) {
            ctx.forceResponseCode = 401;
            throw new Error('Invalid Auth Provided. Token not Valid.');
        }
        return new MutationWithAuthResolver(user, token);
    }

    async constant({value}) {
        return value;
    }

    async enumOptions({name}) {
        try {
            const enm = require('../util/enums/' + name);
            return enm.values.map(v => ({
                key: v,
                val: v
            }));
        } catch (c) {
            log.error(c);
            throw new Error('Unknown or bad Enum');
        }
    }

    static get bean() {
        if (!ResolverRoot.instance) {
            ResolverRoot.instance = new ResolverRoot();
        }
        return ResolverRoot.instance;
    }
};
