/**
 * User model
 * */
const MongoDbModel = require('../../bootloader/mongo');
// For Number types better reading
const Float = Number;
const Int = Number;

class User extends MongoDbModel {

    /*Define which database to connect to*/
    static get connection() {
        return this.APP_DB;
    }

    /* Needed functions by the MongoDbModel Interface */
    static get Name() {
        return this.name;
    }

    static get Schema() {
        return mongoose => ({
            name: String,
            gender: /*EnumGender: MALE, FEMALE, OTHER*/ String,
            emails: [{
                address: String,
                isVerified: Boolean,
                isPrimary: Boolean,
                addedAtDate: String,
                verifiedAtDate: String,
                madePrimaryAtDate: String
            }],
            phones: [{
                number: String,
                countryCode: String,
                isVerified: Boolean,
                isPrimary: Boolean,
                addedAtDate: String,
                verifiedAtDate: String,
                madePrimaryAtDate: String
            }],
            naiveAuthPass: String,
            status: /*EnumUserStatus: ENABLED, DISABLED, PSEUDO*/ String,
            picture: {
                storage: /*EnumFileStorage: S3, LOCAL, REMOTE_URL*/ String,
                uri: String,
                name: String,
                mime: String,
                size: Float,
                sizeUnit: /*EnumSizeUnit: B, KB, MB, GB, TB*/ String
            },
            socialProfiles: [{
                platform: /*EnumSocialProfilePlatform: FACEBOOK, TWITTER, GITHUB, APPLE, GOOGLE, MICROSOFT*/ String,
                oauth: Boolean,
                profileId: String,
                handle: String,
                url: String,
                token: String,
                refreshToken: String
            }],
            createdAt: Number,
            updatedAt: Number,
            createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        })
    }

    static get Indexes() {
        return [];
    }
}

exports = module.exports = User;

