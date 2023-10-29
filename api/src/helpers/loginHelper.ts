import { User } from '../models/User';

export default async function loginHelper(emailOrUsername: string, checker: RegExp){
    if(checker.test(emailOrUsername)){
        const user = await User.findOne({ email: emailOrUsername }).lean();
        return user;
    }else if (emailOrUsername.length >= 2){
        const user = await User.findOne({ username: emailOrUsername }).lean();
        return user;
    }else{
        return false
    }
}